class Room {
  constructor({ name, bookings, rate, discount }) {
    this.name = name;
    this.bookings = bookings;
    this.rate = rate;
    this.discount = discount;
  }

  isOccupied(date) {
    const booked = new Date(date);

    const occupiedRooms = this.bookings.filter((booking) => {
      return booking.checkIn <= booked && booking.checkOut >= booked;
    });

    return occupiedRooms.length > 0
      ? occupiedRooms.map((booking) => booking.name).join(", ")
      : false;
  }

  occupancyPercentage({ startDate, endDate }) {
    const startBookingDate = new Date(startDate);
    const endBookingDate = new Date(endDate);

    const bookings = this.bookings.filter((booking) => {
      return (
        booking.checkIn <= endBookingDate &&
        booking.checkOut >= startBookingDate
      );
    });

    const occupiedTime = bookings.map((booking) => {
      const time = booking.checkOut.getTime() - booking.checkIn.getTime();
      const bookingDays = time / (1000 * 60 * 60 * 24);

      const timePassByUser =
        endBookingDate.getTime() - startBookingDate.getTime();
      const days = timePassByUser / (1000 * 60 * 60 * 24);

      return +((bookingDays / days) * 100);
    });

    const totalOccupiedTime = occupiedTime.reduce((acc, curr) => {
      return acc + curr;
    }, 0);

    return +totalOccupiedTime.toFixed(2);
  }
}

class Booking {
  constructor({ name, email, checkIn, checkOut, discount, room }) {
    this.name = name;
    this.email = email;
    this.checkIn = new Date(checkIn);
    this.checkOut = new Date(checkOut);
    this.discount = discount;
    this.room = room;
  }

  getFee() {
    return (
      this.room.rate -
      (this.room.rate * (this.discount + this.room.discount)) / 100
    );
  }
}

function totalOccupancyPercentage({ rooms, startDate, endDate }) {
  const listOfOccupancyPercentage = rooms.map((room) => {
    return room.occupancyPercentage({ startDate, endDate });
  });

  const totalOccupancyPercentage = listOfOccupancyPercentage.reduce(
    (acc, curr) => {
      return acc + curr;
    },
    0
  );

  return +totalOccupancyPercentage.toFixed(2);
}

function availableRooms({ rooms, startDate, endDate }) {
  const listOfAvailableRooms = rooms.filter((room) => {
    return !room.isOccupied(startDate) && !room.isOccupied(endDate);
  });
  return listOfAvailableRooms;
}

module.exports = {
  Room,
  Booking,
  totalOccupancyPercentage,
  availableRooms,
};
