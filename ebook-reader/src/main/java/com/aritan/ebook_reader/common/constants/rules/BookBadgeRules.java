package com.aritan.ebook_reader.common.constants.rules;

import java.math.BigDecimal;

public final class BookBadgeRules {
    public static final long BESTSELLER_SOLD = 1000L;
    public static final long HOT_REVIEW_COUNT = 100L;
    public static final BigDecimal HOT_RATING =
            BigDecimal.valueOf(4.5);
    public static final long NEW_DAYS = 30L;

    private BookBadgeRules() {}
}
