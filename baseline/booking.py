"""Room availability checks using integer minutes after midnight."""


def can_book(start, end, now, blocked, existing):
    """Return True only for a valid, available request; never create a booking.

    start and end must be Python integers, excluding booleans. Assume now is
    a valid integer from 0 to 1439, blocked is a boolean, and existing is a
    reusable collection of valid same-day (start, end) intervals. Intervals
    are half-open: [start, end), so touching endpoints are allowed. Inputs
    are only read and are never modified.
    """
    # AC1: Reject strings, floats, booleans and other non-integer candidates.
    if type(start) is not int or type(end) is not int:
        return False

    # AC1: Stay within the same day and require a positive duration.
    if not 0 <= start < end <= 1440:
        return False
    if start <= now:
        return False

    # AC2: The 120-minute limit is inclusive.
    if end - start > 120:
        return False

    # AC3: A blocked room is always unavailable.
    if blocked:
        return False

    # AC4: Strict comparisons allow a shared endpoint without overlap.
    for busy_start, busy_end in existing:
        if start < busy_end and end > busy_start:
            return False

    # AC5: Return a boolean without writing to any input.
    return True
