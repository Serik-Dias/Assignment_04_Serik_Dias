"""Run with: python3 -m unittest -v test_booking.py"""

from copy import deepcopy
import unittest

from booking import can_book


# ID, description, start, end, now, blocked, existing, expected
CASES = [
    ("T01", "touching after", 660, 720, 540, False, [(600, 660)], True),
    ("T02", "overlap", 630, 690, 540, False, [(600, 660)], False),
    ("T03", "blocked", 660, 720, 540, True, [(600, 660)], False),
    ("T04", "exactly 120 minutes", 720, 840, 540, False, [(600, 660)], True),
    ("T05", "121 minutes", 720, 841, 540, False, [(600, 660)], False),
    ("T06", "starts now", 540, 570, 540, False, [(600, 660)], False),
    ("T07", "reversed", 720, 660, 540, False, [(600, 660)], False),
    ("T08", "zero duration", 660, 660, 540, False, [(600, 660)], False),
    ("T09", "negative start", -10, 60, 540, False, [(600, 660)], False),
    ("T10", "end beyond day", 1390, 1441, 540, False, [(600, 660)], False),
    ("T11", "end at 1440", 1320, 1440, 540, False, [(600, 660)], True),
    ("T12", "start at 1440", 1440, 1441, 540, False, [(600, 660)], False),
    ("T13", "starts before now", 500, 550, 540, False, [(600, 660)], False),
    ("T14", "overlap second booking", 780, 840, 540, False, [(600, 660), (810, 870)], False),
    ("T15", "gap between bookings", 660, 720, 540, False, [(600, 660), (780, 840)], True),
    ("T16", "touching before", 550, 600, 540, False, [(600, 660)], True),
    ("T17", "contains booking", 590, 670, 540, False, [(600, 660)], False),
    ("T18", "inside booking", 610, 620, 540, False, [(600, 660)], False),
    ("T19", "identical booking", 600, 660, 540, False, [(600, 660)], False),
    ("T20", "no existing bookings", 660, 720, 540, False, [], True),
    ("T21", "blocked with no bookings", 660, 720, 540, True, [], False),
    ("T22", "string start", "660", 720, 540, False, [(600, 660)], False),
    ("T23", "fractional start", 660.5, 720, 540, False, [(600, 660)], False),
    ("T24", "boolean start", True, 60, 0, False, [], False),
    ("T25", "missing start", None, 720, 540, False, [(600, 660)], False),
    ("T26", "string end", 660, "720", 540, False, [(600, 660)], False),
    ("T27", "fractional end", 660, 720.5, 540, False, [(600, 660)], False),
    ("T28", "boolean end", 0, True, 0, False, [], False),
    ("T29", "missing end", 660, None, 540, False, [(600, 660)], False),
    ("T30", "midnight cannot follow now zero", 0, 60, 0, False, [], False),
    ("T31", "one minute", 541, 542, 540, False, [(600, 660)], True),
    ("T32", "last minute of day", 1439, 1440, 1438, False, [], True),
    ("T33", "no future start at final minute", 1439, 1440, 1439, False, [], False),
    ("T34", "touches both bookings", 660, 720, 540, False, [(600, 660), (720, 780)], True),
    ("T35", "one minute overlap at start", 659, 700, 540, False, [(600, 660)], False),
    ("T36", "one minute overlap at end", 550, 601, 540, False, [(600, 660)], False),
]


class BookingTests(unittest.TestCase):
    def test_acceptance_cases(self):
        for case_id, description, start, end, now, blocked, existing, expected in CASES:
            with self.subTest(case=case_id, description=description):
                before = deepcopy(existing)
                result = can_book(start, end, now, blocked, existing)
                self.assertIs(result, expected)
                self.assertEqual(existing, before)

    def test_whole_valued_floats_are_not_python_integers(self):
        self.assertIs(can_book(660.0, 720, 540, False, []), False)
        self.assertIs(can_book(660, 720.0, 540, False, []), False)

    def test_nested_lists_remain_unchanged_after_repeated_checks(self):
        existing = [[600, 660], [780, 840]]
        before = deepcopy(existing)
        self.assertIs(can_book(660, 720, 540, False, existing), True)
        self.assertIs(can_book(630, 690, 540, False, existing), False)
        self.assertIs(can_book(660, 720, 540, True, existing), False)
        self.assertEqual(existing, before)

    def test_tuple_collection_is_supported(self):
        existing = ((600, 660), (780, 840))
        self.assertIs(can_book(660, 720, 540, False, existing), True)
        self.assertEqual(existing, ((600, 660), (780, 840)))


if __name__ == "__main__":
    unittest.main()
