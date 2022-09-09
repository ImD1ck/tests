import {
  Room,
  Booking,
  totalOccupancyPercentage,
  availableRooms,
  RoomData,
  BookingData,
} from "./index";


const roomTemplateExample: RoomData = {
  name: "suite",
  bookings: [],
  rate: 50000,
  discount: 0,
};

const bookingTemplateExample: BookingData = {
  name: "Belén Jaraba",
  email: "test@jest.com",
  checkIn: new Date("20 May 2022 14:00 UTC").toISOString(),
  checkOut: new Date("25 May 2022 14:00 UTC").toISOString(),
  discount: 0,
  room: new Room({ ...roomTemplateExample }),
};

describe("Room: isOccuped()", () => {
  test("If the room is not occupied and the bookings are empty", () => {
    const room = new Room({ ...roomTemplateExample });
    expect(room.isOccupied("5 Oct 2021 14:00 UTC")).toBeFalsy();
  });

  test("If the room is not ocuppied, return false", () => {
    const booking = [
      new Booking({
        ...bookingTemplateExample,
        checkIn: "1 Aug 2022 14:00 UTC",
        checkOut: "10 Aug 2022 14:00 UTC",
      }),
      new Booking({
        ...bookingTemplateExample,
        checkIn: "5 Sep 2022 14:00 UTC",
        checkOut: "13 Sep 2022 14:00 UTC",
      }),
    ];
    const room = new Room({ ...roomTemplateExample, bookings: booking });
  
    const actualValue = room.isOccupied("2022-10-18");
    
    expect(actualValue).toBeFalsy();
  });

  test("If the room is occupied, return the name of the guest", () => {
    const room = new Room({ ...roomTemplateExample });
    const booking1 = new Booking({ ...bookingTemplateExample });
    room.bookings.push(booking1);
    expect(
      room.isOccupied(new Date("25 May 2022 14:00 UTC").toISOString())
    ).toBe("Belén Jaraba");
  });
});

describe("Room: occupancyPercentage()", () => {
  test("If the room is occupied, return the percentage (in that case 25%)", () => {
    const room = new Room({ ...roomTemplateExample });
    expect(
      room.occupancyPercentage({
        startDate: new Date("20 May 2022 14:00 UTC").toISOString(),
        endDate: new Date("25 May 2022 14:00 UTC").toISOString(),
      })
    ).toBe(25);
  });

  test("If the room is occupied, return the percentage (in that case 75%)", () => {
    const bookings = [
      {
        ...bookingTemplateExample,
        checkIn: new Date("1 Jan 2022 14:00 UTC").toISOString(),
        checkOut: new Date("6 Jan 2022 14:00 UTC").toISOString(),
      },
      {
        ...bookingTemplateExample,
        checkIn: new Date("4 Apr 2022 14:00 UTC").toISOString(),
        checkOut: new Date("10 Apr 2022 14:00 UTC").toISOString(),
      },
      {
        ...bookingTemplateExample,
        checkIn: new Date("6 Jun 2022 14:00 UTC").toISOString(),
        checkOut: new Date("10 Jun 2022 14:00 UTC").toISOString(),
      },
      {
        ...bookingTemplateExample,
        checkIn: new Date("13 Jul 2022 14:00 UTC").toISOString(),
        checkOut: new Date("23 Jul 2022 14:00 UTC").toISOString(),
      },
      {
        ...bookingTemplateExample,
        checkIn: new Date("1 Aug 2022 14:00 UTC").toISOString(),
        checkOut: new Date("10 Aug 2022 14:00 UTC").toISOString(),
      },
    ];
    const room = new Room({ ...roomTemplateExample, bookings: bookings });
    expect(
      room.occupancyPercentage({
        startDate: new Date("4 Sep 2022 14:00 UTC").toDateString(),
        endDate: new Date("24 Sep 2022 14:00 UTC").toISOString(),
      })
    ).toBe(75);
  });
});

describe("Booking: getFee()", () => {
  test("If there is not any discount: ", () => {
    const room = new Room({ ...roomTemplateExample });
    const booking = new Booking({
      name: "Lorena Pérez",
      email: "test2@jest.com",
      checkIn: new Date("4 Sep 2022 14:00 UTC").toDateString(),
      checkOut: new Date("24 Sep 2022 14:00 UTC").toISOString(),
      discount: 0,
      room: room,
    });
    room.bookings.push(booking);
    expect(booking.getFee()).toBe(500);
  });

  test("If there is discount (rooms: 15%) return the percentage: ", () => {
    const booking = new Booking({
      ...bookingTemplateExample,
      room: new Room({ ...roomTemplateExample, discount: 15 }),
    });
    expect(booking.getFee()).toBe(425); /* 500 * 0.15 = 75 | 500 - 75 = 425 */
  });

  test("If there is discount (rooms: 50%) return the percentage: ", () => {
    const booking = new Booking({
      ...bookingTemplateExample,
      room: new Room({ ...roomTemplateExample, discount: 50 }),
    });
    expect(booking.getFee()).toBe(250); /* 500 * 0.50 = 250 | 500 - 250 = 250 */
  });

  test("If there is discount (booking: 25%) return the percentage: ", () => {
    const booking = new Booking({
      ...bookingTemplateExample,
      discount: 25,
    });
    expect(booking.getFee()).toBe(375); /* 500 * 0.25 = 125 | 500 - 125 = 375 */
  });

  test("If there is discount (booking: 70%) return the percentage: ", () => {
    const booking = new Booking({
      ...bookingTemplateExample,
      discount: 50,
    });
    expect(booking.getFee()).toBe(250); /* 500 * 0.70 = 350 | 500 - 350 = 150 */
  });
});

describe("Room and Booking: totalOccupancyPercentage()", () => {
  const bookings = [
    {
      ...bookingTemplateExample,
      checkIn: new Date("1 Jan 2022 14:00 UTC").toISOString(),
      checkOut: new Date("6 Jan 2022 14:00 UTC").toISOString(),
    },
    {
      ...bookingTemplateExample,
      checkIn: new Date("4 Apr 2022 14:00 UTC").toISOString(),
      checkOut: new Date("10 Apr 2022 14:00 UTC").toISOString(),
    },
    {
      ...bookingTemplateExample,
      checkIn: new Date("6 Jun 2022 14:00 UTC").toISOString(),
      checkOut: new Date("10 Jun 2022 14:00 UTC").toISOString(),
    },
    {
      ...bookingTemplateExample,
      checkIn: new Date("13 Jul 2022 14:00 UTC").toISOString(),
      checkOut: new Date("23 Jul 2022 14:00 UTC").toISOString(),
    },
  ];

  test(" If there are reservations, it returns the percentage of the rooms occupied", () => {
    /* 
          Bookings for Suite: 4
          Bookings for Double Suite: 4 
          Total reservations: 8
          Limit of Bookings: 100
  
          ( 8 / 100) * 100 = 8
  
          Total percentage expected: 8%
      */
    const rooms = [
      new Room({ ...roomTemplateExample, bookings: bookings }),
      new Room({
        ...roomTemplateExample,
        name: "double suite",
        bookings: bookings,
      }),
    ];

    expect(
      totalOccupancyPercentage({
        rooms: [...rooms],
        startDate: new Date("1 Jan 2022 14:00 UTC").toISOString(),
        endDate: new Date("23 Jul 2022 14:00 UTC").toISOString(),
      })
    ).toBe(8);
  });

  test(" If it is fully booked, it returns 100%", () => {
    /* 
          Bookings for Suite: 8
          Bookings for Double Suite: 8 
          Total: 16
          Limit of bookings: 16
  
          Total percentage expected: 100%
         */

    const bookings2 = [
      {
        ...bookingTemplateExample,
        checkIn: new Date("1 Jan 2022 14:00 UTC").toISOString(),
        checkOut: new Date("6 Jan 2022 14:00 UTC").toISOString(),
      },
      {
        ...bookingTemplateExample,
        checkIn: new Date("4 Apr 2022 14:00 UTC").toISOString(),
        checkOut: new Date("10 Apr 2022 14:00 UTC").toISOString(),
      },
      {
        ...bookingTemplateExample,
        checkIn: new Date("6 Jun 2022 14:00 UTC").toISOString(),
        checkOut: new Date("10 Jun 2022 14:00 UTC").toISOString(),
      },
      {
        ...bookingTemplateExample,
        checkIn: new Date("13 Jul 2022 14:00 UTC").toISOString(),
        checkOut: new Date("23 Jul 2022 14:00 UTC").toISOString(),
      },
      {
        ...bookingTemplateExample,
        checkIn: new Date("1 Aug 2022 14:00 UTC").toISOString(),
        checkOut: new Date("6 Aug 2022 14:00 UTC").toISOString(),
      },
      {
        ...bookingTemplateExample,
        checkIn: new Date("7 Sep 2022 14:00 UTC").toISOString(),
        checkOut: new Date("10 Sep 2022 14:00 UTC").toISOString(),
      },
      {
        ...bookingTemplateExample,
        checkIn: new Date("6 Oct 2022 14:00 UTC").toISOString(),
        checkOut: new Date("10 Oct 2022 14:00 UTC").toISOString(),
      },
      {
        ...bookingTemplateExample,
        checkIn: new Date("13 Nov 2022 14:00 UTC").toISOString(),
        checkOut: new Date("23 Nov 2022 14:00 UTC").toISOString(),
      },
    ];

    const rooms = [
      new Room({ ...roomTemplateExample, bookings: bookings }),
      new Room({
        ...roomTemplateExample,
        name: "double suite",
        bookings: bookings2,
      }),
    ];

    expect(
      totalOccupancyPercentage({
        rooms: [...rooms],
        startDate: new Date("1 Jan 2022 14:00 UTC").toISOString(),
        endDate: new Date("23 Nov 2022 14:00 UTC").toISOString(),
      })
    ).toBe(100);
  });
});

describe("Room and Booking: availableRooms()", () => {
  const bookings = [
    {
      ...bookingTemplateExample,
      checkIn: new Date("1 Jan 2022 14:00 UTC").toISOString(),
      checkOut: new Date("6 Jan 2022 14:00 UTC").toISOString(),
    },
    {
      ...bookingTemplateExample,
      checkIn: new Date("4 Apr 2022 14:00 UTC").toISOString(),
      checkOut: new Date("10 Apr 2022 14:00 UTC").toISOString(),
    },
    {
      ...bookingTemplateExample,
      checkIn: new Date("6 Jun 2022 14:00 UTC").toISOString(),
      checkOut: new Date("10 Jun 2022 14:00 UTC").toISOString(),
    },
    {
      ...bookingTemplateExample,
      checkIn: new Date("13 Jul 2022 14:00 UTC").toISOString(),
      checkOut: new Date("23 Jul 2022 14:00 UTC").toISOString(),
    },
  ];

  test("Return the availables rooms ", () => {
    /* 
          Bookings for Suite: 4
          Bookings for Double Suite: 4
          Total reservations: 8
          Limit of Bookings: 100
  
          Total percentage expected: 8% => 0.08 percentage in decimal
      */
    const rooms = [
      new Room({ ...roomTemplateExample, bookings: bookings }),
      new Room({
        ...roomTemplateExample,
        name: "double suite",
        bookings: bookings,
      }),
    ];

    //(100 - 0.08) / 100 = 0.992 => rounded: 1% => 0.1 percentage of occupied rooms
    const totalAvailablesRooms = 99; //(100 - 0.1) * 100 => 99% available rooms

    expect(
      availableRooms({
        rooms: [...rooms],
        startDate: new Date("1 Jan 2022 14:00 UTC").toISOString(),
        endDate: new Date("23 Jul 2022 14:00 UTC").toISOString(),
      })
    ).toBe(totalAvailablesRooms);
  });

  test("If there aren't availables rooms, return false ", () => {
    /* 
          Bookings for Suite: 4 
          Bookings for Double Suite: 4
          Total reservations: 8
  
          Limit of Bookings: 100
  
      */
    const rooms = [
      new Room({ ...roomTemplateExample, bookings: bookings }),
      new Room({
        ...roomTemplateExample,
        name: "double suite",
        bookings: bookings,
      }),
    ];

    expect(
      availableRooms({
        rooms: [...rooms],
        startDate: new Date("1 Jan 2022 14:00 UTC").toISOString(),
        endDate: new Date("23 Jul 2022 14:00 UTC").toISOString(),
      })
    ).toBeFalsy();
  });
});
