const {
  Room,
  Booking,
  totalOccupancyPercentage,
  availableRooms,
} = require("./index");

const roomTemplate = {
  bookings: [],
  rate: 100,
  discount: 40,
};

test("booking free", () => {
  const room1 = new Room({ ...roomTemplate, name: "room1" });
  const booking1 = new Booking({
    name: "Carlos",
    email: "hola@hola.com",
    checkIn: "2022-08-01",
    checkOut: "2022-08-03",
    discount: 25,
    room: room1,
  });
  const booking2 = new Booking({
    name: "Andres",
    email: "hola2@hola2.com",
    checkIn: "2022-08-10",
    checkOut: "2022-08-15",
    discount: 10,
    room: room1,
  });
  room1.bookings = [booking1, booking2];

  expect(room1.isOccupied("2022-08-05")).toBeFalsy();
});

test("booking occupied and return the guest name", () => {
  const room1 = new Room({ ...roomTemplate, name: "room1" });
  const booking1 = new Booking({
    name: "Carlos",
    email: "hola@hola.com",
    checkIn: "2022-08-01",
    checkOut: "2022-08-03",
    discount: 40,
    room: room1,
  });
  const booking2 = new Booking({
    name: "Andres",
    email: "hola2@hola2.com",
    checkIn: "2022-08-10",
    checkOut: "2022-08-15",
    discount: 0,
    room: room1,
  });
  room1.bookings = [booking1, booking2];

  expect(room1.isOccupied("2022-08-01")).toContain(room1.bookings[0].name);
});

test("return occupied percentage", () => {
  const room1 = new Room({ ...roomTemplate, name: "room1" });
  const booking1 = new Booking({
    name: "Carlos",
    email: "hola@hola.com",
    checkIn: "2022-08-01",
    checkOut: "2022-08-03",
    discount: 35,
    room: room1,
  });
  const booking2 = new Booking({
    name: "Andres",
    email: "hola2@hola2.com",
    checkIn: "2022-08-10",
    checkOut: "2022-08-15",
    discount: 0,
    room: room1,
  });
  room1.bookings = [booking1, booking2];

  expect(
    room1.occupancyPercentage({
      startDate: "2022-08-01",
      endDate: "2022-08-05",
    })
  ).toBe(50);
});

test("return fee", () => {
  const room1 = new Room({ ...roomTemplate, name: "room1" });
  const booking1 = new Booking({
    name: "Carlos",
    email: "hola@hola.com",
    checkIn: "2022-10-01",
    checkOut: "2022-10-05",
    discount: 10,
    room: room1,
  });
  room1.bookings = [booking1];

  expect(booking1.getFee()).toBe(50);
});

test("return the total occupancy percentage", () => {
  const room1 = new Room({ ...roomTemplate, name: "room1" });
  const room2 = new Room({ ...roomTemplate, name: "room2" });
  const booking1 = new Booking({
    name: "Carlos",
    email: "hola@hola.com",
    checkIn: "2022-08-01",
    checkOut: "2022-08-03",
    discount: 50,
    room: room1,
  });
  const booking2 = new Booking({
    name: "Andres",
    email: "hola2@hola2.com",
    checkIn: "2022-08-10",
    checkOut: "2022-08-15",
    discount: 20,
    room: room1,
  });
  const booking3 = new Booking({
    name: "Ana",
    email: "hola3@hola.com",
    checkIn: "2022-10-01",
    checkOut: "2022-10-07",
    discount: 20,
    room: room2,
  });
  room1.bookings = [booking1, booking2];
  room1.bookings = [booking1, booking2];
  room2.bookings = [booking3];

  expect(
    totalOccupancyPercentage({
      rooms: [room1, room2],
      startDate: "2022-08-01",
      endDate: "2022-10-05",
    })
  ).toBe(20);
});

test("return all the available rooms", () => {
  const room1 = new Room({ ...roomTemplate, name: "room1" });
  const room2 = new Room({ ...roomTemplate, name: "room2" });
  const booking1 = new Booking({
    name: "Carlos",
    email: "hola@hola.com",
    checkIn: "2022-08-01",
    checkOut: "2022-08-03",
    discount: 10,
    room: room1,
  });
  const booking2 = new Booking({
    name: "Andres",
    email: "hola2@hola2.com",
    checkIn: "2022-08-10",
    checkOut: "2022-08-15",
    discount: 0,
    room: room1,
  });
  const booking3 = new Booking({
    name: "Ana",
    email: "hola3@hola.com",
    checkIn: "2022-10-01",
    checkOut: "2022-10-07",
    discount: 30,
    room: room2,
  });
  room1.bookings = [booking1];
  room1.bookings = [booking2];
  room2.bookings = [booking3];

  expect(
    availableRooms({
      rooms: [room1, room2],
      startDate: "2022-07-01",
      endDate: "2022-07-20",
    })
  ).toContain(room2);
});
