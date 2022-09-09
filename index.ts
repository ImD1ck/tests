export interface BookingData {
  name: string;
  email: string;
  checkIn: string;
  checkOut: string;
  discount: number;
  room: Room;
}

export interface RoomData {
  name: string;
  bookings: Array<BookingData>;
  rate: number;
  discount: number;
}

export class Room implements RoomData {
  name;
  bookings;
  rate;
  discount;

  constructor({ name, bookings, rate, discount }: RoomData) {
    this.name = name;
    this.bookings = bookings;
    this.rate = rate;
    this.discount = discount;
  }

  isOccupied(date: string) : boolean|string {
    const bookings = this.bookings;
    if (this.bookings.length) {
      for (let i = 0; i < bookings.length; i++) {
        if (date >= bookings[i].checkIn && date <= bookings[i].checkOut)
          return bookings[i].name; 
      }
      return false; 
    }
    return false;
  }

  occupancyPercentage({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }): number {
    const bookings = this.bookings;

    let reservedBookings = []; 

    for (let i = 0; i < bookings.length; i++) {
      if (startDate >= bookings[i].checkIn && endDate <= bookings[i].checkOut) {
        reservedBookings.push(bookings[i]);
      }
    }

    return Math.round((reservedBookings.length / bookings.length) * 100); 
  }
}

export class Booking implements BookingData {
  name;
  email;
  checkIn;
  checkOut;
  discount;
  room;

  constructor({ name, email, checkIn, checkOut, discount, room }: BookingData) {
    this.name = name;
    this.email = email;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.discount = discount;
    this.room = room;
  }

  getFee() {
    const rate = this.room.rate;
    const discountRoom = rate * (this.room.discount / 100);
    const discountBooking = rate * (this.discount / 100);
    const totalDiscount = discountRoom + discountBooking;
    const price = totalDiscount > rate ? 0 : (rate - totalDiscount) / 100;
    return price;
  }
}

export const totalOccupancyPercentage = ({
  rooms,
  startDate,
  endDate,
}: {
  rooms: Array<Room>;
  startDate: string;
  endDate: string;
}) => {
  const totalDaysIsOccupied = rooms
    .map((room) =>
      room.occupancyPercentage({ startDate: startDate, endDate: endDate })
    )
    .reduce((prevValue, currentValue) => currentValue + prevValue, 0);
  const results = Math.round(totalDaysIsOccupied / rooms.length);
  return results;
};

export const availableRooms = ({
  rooms,
  startDate,
  endDate,
}: {
  rooms: Array<Room>;
  startDate: string;
  endDate: string;
}) => {
  const totalPercentage = 100;

  const occupancyRooms = totalOccupancyPercentage({
    rooms: rooms,
    startDate: startDate,
    endDate: endDate,
  }); 
  const occupancyRoomsInDecimal = Math.round(occupancyRooms / 100);
  const totalPercentageOfAvailableRooms =
    Math.round(totalPercentage - occupancyRoomsInDecimal) * 100; 

  return totalPercentageOfAvailableRooms;
};
