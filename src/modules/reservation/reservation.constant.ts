export const ReservationStatuses = {
  BOOKED: 'BOOKED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
};

export const LastReservationStatuses = [
  ReservationStatuses.CANCELLED,
  ReservationStatuses.COMPLETED,
  ReservationStatuses.FAILED,
];

export const PendingReservationStatuses = [
  ReservationStatuses.BOOKED,
  ReservationStatuses.IN_PROGRESS,
];
