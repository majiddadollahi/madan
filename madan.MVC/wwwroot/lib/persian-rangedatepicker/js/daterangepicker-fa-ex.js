(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['moment', 'jquery', 'exports'], function (momentjs, $, exports) {
            root.daterangepicker = factory(root, exports, momentjs, $);
        });
    } else if (typeof exports !== 'undefined') {
        var jQuery = (typeof window != 'undefined') ? window.jQuery : undefined;
        if (!jQuery) {
            try {
                if (!jQuery.fn) jQuery.fn = {};
            } catch (err) {
                if (!jQuery) throw new Error('jQuery dependency not found');
            }
        }
        factory(root, exports, momentjs, jQuery);
    } else {
        root.daterangepicker = factory(root, {}, root.moment || moment, (root.jQuery || root.Zepto || root.ender || root.$));
    }
}(this || {}, function (root, daterangepicker, moment, $) {
    var DateRangePicker = function (element, options, cb) {
        if (options.jalaali) { }
        this.parentEl = 'body';
        this.element = $(element);
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.minDate = false;
        this.maxDate = false;
        this.dateLimit = false;
        this.autoApply = false;
        this.singleDatePicker = false;
        this.showDropdowns = false;

        //Omid drpYearOffset
        this.dropdownMinYearOffset = options.dropdownMinYearOffset || 50;
        this.dropdownMaxYearOffset = options.dropdownMaxYearOffset || 10;
        //Omid drpYearOffset

        this.showWeekNumbers = false;
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        this.linkedCalendars = true;
        this.autoUpdateInput = true;
        this.language = 'en';
        this.ranges = {};
        this.jalaali = false;
        this.opens = 'right';
        if (this.element.hasClass('pull-right'))
            this.opens = 'left';
        this.drops = 'down';
        if (this.element.hasClass('dropup'))
            this.drops = 'up';
        this.buttonClasses = 'btn btn-sm';
        this.applyClass = 'btn-success';
        this.cancelClass = 'btn-default';
        this.locale = {
            format: 'MM/DD/YYYY',
            separator: ' - ',
            applyLabel: 'Apply',
            cancelLabel: 'Cancel',
            weekLabel: 'W',
            customRangeLabel: 'Custom Range',
            daysOfWeek: moment.weekdaysMin(),
            monthNames: moment.monthsShort(),
            firstDay: moment.localeData().firstDayOfWeek()
        };
        var locale_fa = {
            format: 'jYYYY/jMM/jDD',
            separator: ' - ',
            applyLabel: 'ثبت',
            cancelLabel: 'لغو',
            weekLabel: 'W',
            customRangeLabel: 'بازه دلخواه',
            daysOfWeek: ["ی", "د", "س", "چ", "پ", "ج", "ش"],
            monthNames: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
            firstDay: 6
        };
        this.callback = function () { };
        this.isShowing = false;
        this.leftCalendar = {};
        this.rightCalendar = {};
        if (typeof options !== 'object' || options === null)
            options = {};
        options = $.extend(this.element.data(), options);
        //omid for time
        if (typeof options.template !== 'string')
            options.template = '<div class="daterangepicker dropdown-menu">' + '<div class="calendar left">' +
                '<div class="calendar-table"></div>' +
                '<div class="daterangepicker_input">' + '<input class="input-mini" type="text" name="daterangepicker_start" value="" />' + '<i class="drp-calendar5"></i>' + '<div class="calendar-time">' + '<div></div>' + '<i class="fa fa-clock-o glyphicon glyphdrp-time"></i>' + '</div>' + '</div>' +
                '</div>' + '<div class="calendar right">' +
                '<div class="calendar-table"></div>' +
                '<div class="daterangepicker_input">' + '<input class="input-mini" type="text" name="daterangepicker_end" value="" />' + '<i class="drp-calendar5"></i>' + '<div class="calendar-time">' + '<div></div>' + '<i class="fa fa-clock-o glyphicon glyphdrp-time"></i>' + '</div>' + '</div>' +
                '</div>' + '<div class="ranges">' + '<div class="range_inputs">' + '<button class="applyBtn" disabled="disabled" type="button"></button> ' + '<button class="cancelBtn" type="button"></button>' + '</div>' + '</div>' + '</div>';
        this.parentEl = (options.parentEl && $(options.parentEl).length) ? $(options.parentEl) : $(this.parentEl);
        this.container = $(options.template).appendTo(this.parentEl);
        if (options.jalaali) this.locale = locale_fa;
        if (typeof options.locale === 'object') {
            if (typeof options.locale.format === 'string')
                this.locale.format = options.locale.format;
            if (typeof options.locale.separator === 'string')
                this.locale.separator = options.locale.separator;
            if (typeof options.locale.daysOfWeek === 'object')
                this.locale.daysOfWeek = options.locale.daysOfWeek.slice();
            if (typeof options.locale.monthNames === 'object')
                this.locale.monthNames = options.locale.monthNames.slice();
            if (typeof options.locale.firstDay === 'number')
                this.locale.firstDay = options.locale.firstDay;
            if (typeof options.locale.applyLabel === 'string')
                this.locale.applyLabel = options.locale.applyLabel;
            if (typeof options.locale.cancelLabel === 'string')
                this.locale.cancelLabel = options.locale.cancelLabel;
            if (typeof options.locale.weekLabel === 'string')
                this.locale.weekLabel = options.locale.weekLabel;
            if (typeof options.locale.customRangeLabel === 'string')
                this.locale.customRangeLabel = options.locale.customRangeLabel;
        }
        if (typeof options.startDate === 'string')
            this.startDate = moment(options.startDate, this.locale.format);
        if (typeof options.endDate === 'string')
            this.endDate = moment(options.endDate, this.locale.format);
        if (typeof options.minDate === 'string')
            this.minDate = moment(options.minDate, this.locale.format);
        if (typeof options.maxDate === 'string')
            this.maxDate = moment(options.maxDate, this.locale.format);
        if (typeof options.startDate === 'object')
            this.startDate = moment(options.startDate);
        if (typeof options.endDate === 'object')
            this.endDate = moment(options.endDate);
        if (typeof options.minDate === 'object')
            this.minDate = moment(options.minDate);
        if (typeof options.maxDate === 'object')
            this.maxDate = moment(options.maxDate);
        if (this.minDate && this.startDate.isBefore(this.minDate))
            this.startDate = this.minDate.clone();
        if (this.maxDate && this.endDate.isAfter(this.maxDate))
            this.endDate = this.maxDate.clone();
        if (typeof options.applyClass === 'string')
            this.applyClass = options.applyClass;
        if (typeof options.cancelClass === 'string')
            this.cancelClass = options.cancelClass;
        if (typeof options.dateLimit === 'object')
            this.dateLimit = options.dateLimit;
        if (typeof options.opens === 'string')
            this.opens = options.opens;
        if (typeof options.language === 'string')
            this.language = options.language;
        if (typeof options.drops === 'string')
            this.drops = options.drops;
        if (typeof options.showWeekNumbers === 'boolean')
            this.showWeekNumbers = options.showWeekNumbers;
        if (typeof options.buttonClasses === 'string')
            this.buttonClasses = options.buttonClasses;
        if (typeof options.buttonClasses === 'object')
            this.buttonClasses = options.buttonClasses.join(' ');
        if (typeof options.showDropdowns === 'boolean')
            this.showDropdowns = options.showDropdowns;
        if (typeof options.singleDatePicker === 'boolean') {
            this.singleDatePicker = options.singleDatePicker;
            if (this.singleDatePicker)
                this.endDate = this.startDate.clone();
        }
        if (typeof options.timePicker === 'boolean')
            this.timePicker = options.timePicker;
        if (typeof options.timePickerSeconds === 'boolean')
            this.timePickerSeconds = options.timePickerSeconds;
        if (typeof options.timePickerIncrement === 'number')
            this.timePickerIncrement = options.timePickerIncrement;
        if (typeof options.timePicker24Hour === 'boolean')
            this.timePicker24Hour = options.timePicker24Hour;
        if (typeof options.autoApply === 'boolean')
            this.autoApply = options.autoApply;
        if (typeof options.autoUpdateInput === 'boolean')
            this.autoUpdateInput = options.autoUpdateInput;
        if (typeof options.linkedCalendars === 'boolean')
            this.linkedCalendars = options.linkedCalendars;
        if (typeof options.isInvalidDate === 'function')
            this.isInvalidDate = options.isInvalidDate;
        if (this.locale.firstDay != 0) {
            var iterator = this.locale.firstDay;
            while (iterator > 0) {
                this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                iterator--;
            }
        }
        var start, end, range;
        if (typeof options.startDate === 'undefined' && typeof options.endDate === 'undefined') {
            if ($(this.element).is('input[type=text]')) {
                var val = $(this.element).val(),
                    split = val.split(this.locale.separator);
                start = end = null;
                if (split.length == 2) {
                    start = moment(split[0], this.locale.format);
                    end = moment(split[1], this.locale.format);
                } else if (this.singleDatePicker && val !== "") {
                    start = moment(val, this.locale.format);
                    end = moment(val, this.locale.format);
                }
                if (start !== null && end !== null) {
                    this.setStartDate(start);
                    this.setEndDate(end);
                }
            }
        }
        if (typeof options.ranges === 'object') {
            for (range in options.ranges) {
                if (typeof options.ranges[range][0] === 'string')
                    start = moment(options.ranges[range][0], this.locale.format);
                else
                    start = moment(options.ranges[range][0]);
                if (typeof options.ranges[range][1] === 'string')
                    end = moment(options.ranges[range][1], this.locale.format);
                else
                    end = moment(options.ranges[range][1]);
                if (this.minDate && start.isBefore(this.minDate))
                    start = this.minDate.clone();
                var maxDate = this.maxDate;
                if (this.dateLimit && start.clone().add(this.dateLimit).isAfter(maxDate))
                    maxDate = start.clone().add(this.dateLimit);
                if (maxDate && end.isAfter(maxDate))
                    end = maxDate.clone();
                if ((this.minDate && end.isBefore(this.minDate)) || (maxDate && start.isAfter(maxDate)))
                    continue;
                var elem = document.createElement('textarea');
                elem.innerHTML = range;
                var rangeHtml = elem.value;
                this.ranges[rangeHtml] = [start, end];
            }
            var list = '<ul>';
            for (range in this.ranges) {
                list += '<li>' + range + '</li>';
            }
            list += '<li>' + this.locale.customRangeLabel + '</li>';
            list += '</ul>';
            this.container.find('.ranges').prepend(list);
        }
        if (typeof cb === 'function') {
            this.callback = cb;
        }
        if (!this.timePicker) {
            this.startDate = this.startDate.startOf('day');
            this.endDate = this.endDate.endOf('day');
            this.container.find('.calendar-time').hide();
        }
        if (this.timePicker && this.autoApply)
            this.autoApply = false;
        if (this.autoApply && typeof options.ranges !== 'object') {
            this.container.find('.ranges').hide();
        } else if (this.autoApply) {
            this.container.find('.applyBtn, .cancelBtn').addClass('hide');
        }
        if (this.singleDatePicker) {
            this.container.addClass('single');
            this.container.find('.calendar.left').addClass('single');
            this.container.find('.calendar.left').show();
            this.container.find('.calendar.right').hide();
            this.container.find('.daterangepicker_input input, .daterangepicker_input i').hide();
            if (!this.timePicker) {
                this.container.find('.ranges').hide();
            }
        }
        if (typeof options.ranges === 'undefined' && !this.singleDatePicker) {
            this.container.addClass('show-calendar');
        }
        this.container.addClass('opens' + this.opens);
        if (typeof options.ranges !== 'undefined' && this.opens == 'right') {
            var ranges = this.container.find('.ranges');
            var html = ranges.clone();
            ranges.remove();
            this.container.find('.calendar.left').parent().prepend(html);
        }
        this.container.find('.applyBtn, .cancelBtn').addClass(this.buttonClasses);
        if (this.applyClass.length)
            this.container.find('.applyBtn').addClass(this.applyClass);
        if (this.cancelClass.length)
            this.container.find('.cancelBtn').addClass(this.cancelClass);
        this.container.find('.applyBtn').html(this.locale.applyLabel);
        this.container.find('.cancelBtn').html(this.locale.cancelLabel);
        this.container.find('.calendar').on('click.daterangepicker', '.prev', $.proxy(this.clickPrev, this)).on('click.daterangepicker', '.next', $.proxy(this.clickNext, this)).on('click.daterangepicker', 'td.available', $.proxy(this.clickDate, this)).on('mouseenter.daterangepicker', 'td.available', $.proxy(this.hoverDate, this)).on('mouseleave.daterangepicker', 'td.available', $.proxy(this.updateFormInputs, this)).on('change.daterangepicker', 'select.yearselect', $.proxy(this.monthOrYearChanged, this)).on('change.daterangepicker', 'select.monthselect', $.proxy(this.monthOrYearChanged, this)).on('change.daterangepicker', 'select.hourselect,select.minuteselect,select.secondselect,select.ampmselect', $.proxy(this.timeChanged, this)).on('click.daterangepicker', '.daterangepicker_input input', $.proxy(this.showCalendars, this)).on('change.daterangepicker', '.daterangepicker_input input', $.proxy(this.formInputsChanged, this));
        this.container.find('.ranges').on('click.daterangepicker', 'button.applyBtn', $.proxy(this.clickApply, this)).on('click.daterangepicker', 'button.cancelBtn', $.proxy(this.clickCancel, this)).on('click.daterangepicker', 'li', $.proxy(this.clickRange, this)).on('mouseenter.daterangepicker', 'li', $.proxy(this.hoverRange, this)).on('mouseleave.daterangepicker', 'li', $.proxy(this.updateFormInputs, this));
        if (this.element.is('input')) {
            this.element.on({
                'click.daterangepicker': $.proxy(this.show, this),
                'focus.daterangepicker': $.proxy(this.show, this),
                'keyup.daterangepicker': $.proxy(this.elementChanged, this),
                'keydown.daterangepicker': $.proxy(this.keydown, this)
            });
        } else {
            this.element.on('click.daterangepicker', $.proxy(this.toggle, this));
        }
        if (this.element.is('input') && !this.singleDatePicker && this.autoUpdateInput) {
            this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
            this.element.trigger('change');
        } else if (this.element.is('input') && this.autoUpdateInput) {
            this.element.val(this.startDate.format(this.locale.format));
            this.element.trigger('change');
        }
    };

    function daysInjMonth(year, month) {
        if (month < 6) return 31;
        else if ((month < 11) || moment.jIsLeapYear(year)) return 30;
        else return 29;
    }
    DateRangePicker.prototype = {
        constructor: DateRangePicker,
        setStartDate: function (startDate) {

            if (typeof startDate === 'string')
                this.startDate = moment(startDate, this.locale.format);
            if (typeof startDate === 'object')
                this.startDate = moment(startDate);
            if (!this.timePicker)
                this.startDate = this.startDate.startOf('day');
            if (this.timePicker && this.timePickerIncrement)
                this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            if (this.minDate && this.startDate.isBefore(this.minDate))
                this.startDate = this.minDate;
            if (this.maxDate && this.startDate.isAfter(this.maxDate))
                this.startDate = this.maxDate;
            if (!this.isShowing)
                this.updateElement();
            this.updateMonthsInView();
        },
        setEndDate: function (endDate) {
            if (typeof endDate === 'string')
                this.endDate = moment(endDate, this.locale.format);
            if (typeof endDate === 'object')
                this.endDate = moment(endDate);
            if (!this.timePicker)
                this.endDate = this.endDate.endOf('day');
            if (this.timePicker && this.timePickerIncrement)
                this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            if (this.endDate.isBefore(this.startDate))
                this.endDate = this.startDate.clone();
            if (this.maxDate && this.endDate.isAfter(this.maxDate))
                this.endDate = this.maxDate;
            if (this.dateLimit && this.startDate.clone().add(this.dateLimit).isBefore(this.endDate))
                this.endDate = this.startDate.clone().add(this.dateLimit);
            this.previousRightTime = this.endDate.clone();
            if (!this.isShowing)
                this.updateElement();
            this.updateMonthsInView();
        },
        isInvalidDate: function () {
            return false;
        },
        updateView: function () {
            if (this.timePicker) {
                this.renderTimePicker('left');
                this.renderTimePicker('right');
                if (!this.endDate) {
                    this.container.find('.right .calendar-time select').attr('disabled', 'disabled').addClass('disabled');
                } else {
                    this.container.find('.right .calendar-time select').removeAttr('disabled').removeClass('disabled');
                }
            }
            if (this.endDate) {
                this.container.find('input[name="daterangepicker_end"]').removeClass('active');
                this.container.find('input[name="daterangepicker_start"]').addClass('active');
            } else {
                this.container.find('input[name="daterangepicker_end"]').addClass('active');
                this.container.find('input[name="daterangepicker_start"]').removeClass('active');
            }
            this.updateMonthsInView();
            this.updateCalendars();
            this.updateFormInputs();
        },
        updateMonthsInView: function () {
            if (this.endDate) {
                var jalaali = this.element.data().jalaali;
                if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month && (this.startDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.startDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM')) && (this.endDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.endDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM'))) {
                    return;
                }
                this.leftCalendar.month = jalaali ? this.startDate.clone().jDate(2) : this.startDate.clone().date(2);
                if (!this.linkedCalendars && (this.endDate.month() != this.startDate.month() || this.endDate.year() != this.startDate.year())) {
                    this.rightCalendar.month = jalaali ? this.endDate.clone().jDate(2) : this.endDate.clone().date(2);
                } else {
                    this.rightCalendar.month = jalaali ? this.startDate.clone().jDate(2).add(1, 'jMonth') : this.startDate.clone().date(2).add(1, 'month');
                }
            } else {
                if (this.leftCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM') && this.rightCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM')) {
                    this.leftCalendar.month = jalaali ? this.startDate.clone().jDate(2) : this.startDate.clone().date(2);
                    this.rightCalendar.month = jalaali ? this.startDate.clone().jDate(2).add(1, 'jMonth') : this.startDate.clone().date(2).add(1, 'month');
                }
            }
        },
        updateCalendars: function () {
            if (this.timePicker) {
                var hour, minute, second;
                if (this.endDate) {
                    hour = parseInt(this.container.find('.left .hourselect').val(), 10);
                    minute = parseInt(this.container.find('.left .minuteselect').val(), 10);
                    second = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0;
                    if (!this.timePicker24Hour) {
                        var ampm = this.container.find('.left .ampmselect').val();
                        if (ampm === 'PM' && hour < 12)
                            hour += 12;
                        if (ampm === 'AM' && hour === 12)
                            hour = 0;
                    }
                } else {
                    hour = parseInt(this.container.find('.right .hourselect').val(), 10);
                    minute = parseInt(this.container.find('.right .minuteselect').val(), 10);
                    second = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0;
                    if (!this.timePicker24Hour) {
                        var ampm = this.container.find('.right .ampmselect').val();
                        if (ampm === 'PM' && hour < 12)
                            hour += 12;
                        if (ampm === 'AM' && hour === 12)
                            hour = 0;
                    }
                }
                this.leftCalendar.month.hour(hour).minute(minute).second(second);
                this.rightCalendar.month.hour(hour).minute(minute).second(second);
            }
            this.renderCalendar('left');
            this.renderCalendar('right');
            this.container.find('.ranges li').removeClass('active');
            if (this.endDate == null) return;
            var customRange = true;
            var i = 0;
            for (var range in this.ranges) {
                if (this.timePicker) {
                    if (this.startDate.isSame(this.ranges[range][0]) && this.endDate.isSame(this.ranges[range][1])) {
                        customRange = false;
                        this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').html();
                        break;
                    }
                } else {
                    if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
                        customRange = false;
                        this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').html();
                        break;
                    }
                }
                i++;
            }
            if (customRange) {
                this.chosenLabel = this.container.find('.ranges li:last').addClass('active').html();
                this.showCalendars();
            }
        },
        renderCalendar: function (side) {
            var jalaali = this.element.data().jalaali;
            var calendar = side == 'left' ? this.leftCalendar : this.rightCalendar;
            var month, year, hour, minute, second, daysInMonth, firstDay, lastDay, lastMonth, lastYear, daysInLastMonth, dayOfWeek;
            if (jalaali) {
                month = calendar.month.jMonth();
                year = calendar.month.jYear();
                hour = calendar.month.hour();
                minute = calendar.month.minute();
                second = calendar.month.second();
                daysInMonth = daysInjMonth(year, month);
                firstDay = moment(year + "/" + (month + 1) + "/1", "jYYYY/jMM/jDD");
                lastDay = moment(year + "/" + (month + 1) + "/" + daysInMonth, "jYYYY/jMM/jDD");
                lastMonth = moment(firstDay).subtract(1, 'jMonth').jMonth();
                lastYear = moment(firstDay).subtract(1, 'jMonth').jYear();
                daysInLastMonth = daysInjMonth(lastYear, lastMonth);
                dayOfWeek = firstDay.day();
            } else {
                month = calendar.month.month();
                year = calendar.month.year();
                hour = calendar.month.hour();
                minute = calendar.month.minute();
                second = calendar.month.second();
                daysInMonth = moment([year, month]).daysInMonth();
                firstDay = moment([year, month, 1]);
                lastDay = moment([year, month, daysInMonth]);
                lastMonth = moment(firstDay).subtract(1, 'month').month();
                lastYear = moment(firstDay).subtract(1, 'month').year();
                daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
                dayOfWeek = firstDay.day();
            }
            var calendar = [];
            calendar.firstDay = firstDay;
            calendar.lastDay = lastDay;
            for (var i = 0; i < 6; i++) {
                calendar[i] = [];
            }
            var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
            if (startDay > daysInLastMonth)
                startDay -= 7;
            if (dayOfWeek == this.locale.firstDay)
                startDay = daysInLastMonth - 6;
            var curDate = jalaali ? moment(lastYear + "/" + (lastMonth + 1) + "/" + startDay + " 12:" + minute + ":" + second, "jYYYY/jMM/jDD HH:mm:ss") : moment([lastYear, lastMonth, startDay, 12, minute, second]);
            var col, row;
            for (var i = 0, col = 0, row = 0; i < 42; i++ , col++ , curDate = moment(curDate).add(24, 'hour')) {
                if (i > 0 && col % 7 === 0) {
                    col = 0;
                    row++;
                }
                calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
                curDate.hour(12);
                if (this.minDate && calendar[row][col].format('YYYY-MM-DD') == this.minDate.format('YYYY-MM-DD') && calendar[row][col].isBefore(this.minDate) && side == 'left') {
                    calendar[row][col] = this.minDate.clone();
                }
                if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') == this.maxDate.format('YYYY-MM-DD') && calendar[row][col].isAfter(this.maxDate) && side == 'right') {
                    calendar[row][col] = this.maxDate.clone();
                }
            }
            if (side == 'left') {
                this.leftCalendar.calendar = calendar;
            } else {
                this.rightCalendar.calendar = calendar;
            }
            var minDate = side == 'left' ? this.minDate : this.startDate;
            var maxDate = this.maxDate;
            var selected = side == 'left' ? this.startDate : this.endDate;
            var language = this.language;
            var html = '<table class="table-condensed">';
            html += '<thead>';
            html += '<tr>';
            if (this.showWeekNumbers)
                html += '<th></th>';
            if ((!minDate || minDate.isBefore(calendar.firstDay)) && (!this.linkedCalendars || side == 'left')) {
                html += '<th class="prev available"><i class="drp-angle-left"></i></th>';
            } else {
                html += '<th></th>';
            }
            var dateHtml = this.locale.monthNames[jalaali ? calendar[1][1].jMonth() : calendar[1][1].month()] +
                calendar[1][1].format(jalaali ? " jYYYY" : " YYYY");
            var localMonth = jalaali ? 'jMonth' : 'month',
                localYear = jalaali ? 'jYear' : 'year';
            if (this.showDropdowns) {
                var currentMonth = calendar[1][1][localMonth]();
                var currentYear = calendar[1][1][localYear]();

                //Omid drpYearOffset
                var maxYear = (maxDate && maxDate[localYear]()) || (currentYear + this.dropdownMaxYearOffset);
                var minYear = (minDate && minDate[localYear]()) || (currentYear - this.dropdownMinYearOffset);
                //Omid drpYearOffset

                var inMinYear = currentYear == minYear;
                var inMaxYear = currentYear == maxYear;
                //console.log(calendar[1][1])
                //console.log(currentMonth)
                //console.log(currentYear)
                var monthHtml = '<select class="monthselect">';
                for (var m = 0; m < 12; m++) {
                    if ((!inMinYear || m >= minDate[localMonth]()) && (!inMaxYear || m <= maxDate[localMonth]())) {
                        monthHtml += "<option value='" + m + "'" +
                            (m === currentMonth ? " selected='selected'" : "") + ">" + this.locale.monthNames[m] + "</option>";
                    } else {
                        monthHtml += "<option value='" + m + "'" +
                            (m === currentMonth ? " selected='selected'" : "") + " disabled='disabled'>" + this.locale.monthNames[m] + "</option>";
                    }
                }
                monthHtml += "</select>";
                var yearHtml = '<select class="yearselect">';
                for (var y = minYear; y <= maxYear; y++) {
                    yearHtml += '<option value="' + y + '"' +
                        (y === currentYear ? ' selected="selected"' : '') + '>' + y + '</option>';
                }
                yearHtml += '</select>';
                dateHtml = monthHtml + yearHtml;
            }
            html += '<th colspan="5" class="month">' + dateHtml + '</th>';
            if ((!maxDate || maxDate.isAfter(calendar.lastDay)) && (!this.linkedCalendars || side == 'right' || this.singleDatePicker)) {
                html += '<th class="next available"><i class="drp-angle-right"></i></th>';
            } else {
                html += '<th></th>';
            }
            html += '</tr>';
            html += '<tr>';
            if (this.showWeekNumbers)
                html += '<th class="week">' + this.locale.weekLabel + '</th>';
            $.each(this.locale.daysOfWeek, function (index, dayOfWeek) {
                html += '<th>' + dayOfWeek + '</th>';
            });
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';


            function renderNumber(n) {
                var digits = [],
                    r;
                do {
                    r = n % 10;
                    n = (n - r) / 10;
                    digits.unshift(['&#', r + 1776, ';'].join(''));
                } while (n > 0);


                return digits.join('');

            }
            if (this.endDate == null && this.dateLimit) {
                var maxLimit = this.startDate.clone().add(this.dateLimit).endOf('day');
                if (!maxDate || maxLimit.isBefore(maxDate)) {
                    maxDate = maxLimit;
                }
            }
            for (var row = 0; row < 6; row++) {
                html += '<tr>';
                if (this.showWeekNumbers)
                    html += '<td class="week">' + calendar[row][0].week() + '</td>';
                for (var col = 0; col < 7; col++) {
                    var classes = [];
                    if (calendar[row][col].isSame(new Date(), "day"))
                        classes.push('today');
                    if (jalaali) {
                        if (calendar[row][col].jMonth() != calendar[1][1].jMonth())
                            classes.push('off');
                    } else {
                        if (calendar[row][col].month() != calendar[1][1].month())
                            classes.push('off');
                    }
                    if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day'))
                        classes.push('off', 'disabled');
                    if (maxDate && calendar[row][col].isAfter(maxDate, 'day'))
                        classes.push('off', 'disabled');
                    if (this.isInvalidDate(calendar[row][col]))
                        classes.push('off', 'disabled');
                    if (calendar[row][col].format('YYYY-MM-DD') == this.startDate.format('YYYY-MM-DD'))
                        classes.push('active', 'start-date');
                    if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') == this.endDate.format('YYYY-MM-DD'))
                        classes.push('active', 'end-date');
                    if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate)
                        classes.push('in-range');
                    var cname = '',
                        disabled = false;
                    for (var i = 0; i < classes.length; i++) {
                        cname += classes[i] + ' ';
                        if (classes[i] == 'disabled')
                            disabled = true;
                    }

                    if (!disabled)
                        cname += 'available';
                    html += '<td class="' + cname.replace(/^\s+|\s+$/g, '') + '" data-toggle="tooltip" data-container="body" data-placement="top" title="' + (jalaali ? calendar[row][col].format('DD-MMMM-YYYY') : calendar[row][col].format('jYYYY/jMM/jDD')) + '" data-title="' + 'r' + row + 'c' + col + '">' +
                        (language == 'en' ? (jalaali ? calendar[row][col].jDate() : calendar[row][col].date()) : renderNumber(jalaali ? calendar[row][col].jDate() : calendar[row][col].date())); + '</td>';
                }
                html += '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
            this.container.find('.calendar.' + side + ' .calendar-table').html(html);
        },
        renderTimePicker: function (side) {
            var html, selected, minDate, maxDate = this.maxDate;
            if (this.dateLimit && (!this.maxDate || this.startDate.clone().add(this.dateLimit).isAfter(this.maxDate)))
                maxDate = this.startDate.clone().add(this.dateLimit);
            if (side == 'left') {
                selected = this.startDate.clone();
                minDate = this.minDate;
            } else if (side == 'right') {
                selected = this.endDate ? this.endDate.clone() : this.previousRightTime.clone();
                minDate = this.startDate;
                var timeSelector = this.container.find('.calendar.right .calendar-time div');
                if (timeSelector.html() != '') {
                    selected.hour(timeSelector.find('.hourselect option:selected').val() || selected.hour());
                    selected.minute(timeSelector.find('.minuteselect option:selected').val() || selected.minute());
                    selected.second(timeSelector.find('.secondselect option:selected').val() || selected.second());
                    if (!this.timePicker24Hour) {
                        var ampm = timeSelector.find('.ampmselect option:selected').val();
                        if (ampm === 'PM' && selected.hour() < 12)
                            selected.hour(selected.hour() + 12);
                        if (ampm === 'AM' && selected.hour() === 12)
                            selected.hour(0);
                    }
                    if (selected.isBefore(this.startDate))
                        selected = this.startDate.clone();
                    if (selected.isAfter(maxDate))
                        selected = maxDate.clone();
                }
            }
            html = '<select class="hourselect form-control">';
            var start = this.timePicker24Hour ? 0 : 1;
            var end = this.timePicker24Hour ? 23 : 12;
            for (var i = start; i <= end; i++) {
                var i_in_24 = i;
                if (!this.timePicker24Hour)
                    i_in_24 = selected.hour() >= 12 ? (i == 12 ? 12 : i + 12) : (i == 12 ? 0 : i);
                var time = selected.clone().hour(i_in_24);
                var disabled = false;
                if (minDate && time.minute(59).isBefore(minDate))
                    disabled = true;
                if (maxDate && time.minute(0).isAfter(maxDate))
                    disabled = true;
                if (i_in_24 == selected.hour() && !disabled) {
                    html += '<option value="' + i + '" selected="selected">' + i + '</option>';
                } else if (disabled) {
                    html += '<option value="' + i + '" disabled="disabled" class="disabled">' + i + '</option>';
                } else {
                    html += '<option value="' + i + '">' + i + '</option>';
                }
            }
            html += '</select> ';
            html += ': <select class="minuteselect form-control">';
            for (var i = 0; i < 60; i += this.timePickerIncrement) {
                var padded = i < 10 ? '0' + i : i;
                var time = selected.clone().minute(i);
                var disabled = false;
                if (minDate && time.second(59).isBefore(minDate))
                    disabled = true;
                if (maxDate && time.second(0).isAfter(maxDate))
                    disabled = true;
                if (selected.minute() == i && !disabled) {
                    html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
                } else if (disabled) {
                    html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
                } else {
                    html += '<option value="' + i + '">' + padded + '</option>';
                }
            }
            html += '</select> ';
            if (this.timePickerSeconds) {
                html += ': <select class="secondselect form-control">';
                for (var i = 0; i < 60; i++) {
                    var padded = i < 10 ? '0' + i : i;
                    var time = selected.clone().second(i);
                    var disabled = false;
                    if (minDate && time.isBefore(minDate))
                        disabled = true;
                    if (maxDate && time.isAfter(maxDate))
                        disabled = true;
                    if (selected.second() == i && !disabled) {
                        html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
                    } else if (disabled) {
                        html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
                    } else {
                        html += '<option value="' + i + '">' + padded + '</option>';
                    }
                }
                html += '</select> ';
            }
            if (!this.timePicker24Hour) {
                html += '<select class="ampmselect form-control">';
                var am_html = '';
                var pm_html = '';
                if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate))
                    am_html = ' disabled="disabled" class="disabled"';
                if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate))
                    pm_html = ' disabled="disabled" class="disabled"';
                if (selected.hour() >= 12) {
                    html += '<option value="AM"' + am_html + '>AM</option><option value="PM" selected="selected"' + pm_html + '>PM</option>';
                } else {
                    html += '<option value="AM" selected="selected"' + am_html + '>AM</option><option value="PM"' + pm_html + '>PM</option>';
                }
                html += '</select>';
            }
            this.container.find('.calendar.' + side + ' .calendar-time div').html(html);
        },
        updateFormInputs: function () {
            if (this.container.find('input[name=daterangepicker_start]').is(":focus") || this.container.find('input[name=daterangepicker_end]').is(":focus"))
                return;
            this.container.find('input[name=daterangepicker_start]').val(this.startDate.format(this.locale.format));
            if (this.endDate)
                this.container.find('input[name=daterangepicker_end]').val(this.endDate.format(this.locale.format));
            if (this.singleDatePicker || (this.endDate && (this.startDate.isBefore(this.endDate) || this.startDate.isSame(this.endDate)))) {
                this.container.find('button.applyBtn').removeAttr('disabled');
            } else {
                this.container.find('button.applyBtn').attr('disabled', 'disabled');
            }
        },
        move: function () {
            var parentOffset = {
                top: 0,
                left: 0
            },
                containerTop;
            var parentRightEdge = $(window).width();
            if (!this.parentEl.is('body')) {
                parentOffset = {
                    top: this.parentEl.offset().top - this.parentEl.scrollTop(),
                    left: this.parentEl.offset().left - this.parentEl.scrollLeft()
                };
                parentRightEdge = this.parentEl[0].clientWidth + this.parentEl.offset().left;
            }
            if (this.drops == 'up')
                containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
            else
                containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;
            this.container[this.drops == 'up' ? 'addClass' : 'removeClass']('dropup');
            if (this.opens == 'left') {
                this.container.css({
                    top: containerTop,
                    right: parentRightEdge - this.element.offset().left - this.element.outerWidth(),
                    left: 'auto'
                });
                if (this.container.offset().left < 0) {
                    this.container.css({
                        right: 'auto',
                        left: 9
                    });
                }
            } else if (this.opens == 'center') {
                this.container.css({
                    top: containerTop,
                    left: this.element.offset().left - parentOffset.left + this.element.outerWidth() / 2 -
                        this.container.outerWidth() / 2,
                    right: 'auto'
                });
                if (this.container.offset().left < 0) {
                    this.container.css({
                        right: 'auto',
                        left: 9
                    });
                }
            } else {
                this.container.css({
                    top: containerTop,
                    left: this.element.offset().left - parentOffset.left,
                    right: 'auto'
                });
                if (this.container.offset().left + this.container.outerWidth() > $(window).width()) {
                    this.container.css({
                        left: 'auto',
                        right: 0
                    });
                }
            }
        },
        show: function (e) {
            if (this.isShowing) return;
            this._outsideClickProxy = $.proxy(function (e) {
                this.outsideClick(e);
            }, this);
            $(document).on('mousedown.daterangepicker', this._outsideClickProxy).on('touchend.daterangepicker', this._outsideClickProxy).on('click.daterangepicker', '[data-toggle=dropdown]', this._outsideClickProxy).on('focusin.daterangepicker', this._outsideClickProxy);
            $(window).on('resize.daterangepicker', $.proxy(function (e) {
                this.move(e);
            }, this));
            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();
            this.previousRightTime = this.endDate.clone();
            this.updateView();
            this.container.show();
            this.move();
            this.element.trigger('show.daterangepicker', this);
            this.isShowing = true;
        },
        hide: function (updateElement) {
            if (!this.isShowing) return;

            if (updateElement == undefined)
                updateElement = true;

            if (!this.endDate) {
                this.startDate = this.oldStartDate.clone();
                this.endDate = this.oldEndDate.clone();
            }
            if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate))
                this.callback(this.startDate, this.endDate, this.chosenLabel);

            if (updateElement)
                this.updateElement();
            else
                this.element.val('').change();

            $(document).off('.daterangepicker');
            $(window).off('.daterangepicker');
            this.container.hide();
            this.element.trigger('hide.daterangepicker', this);
            this.isShowing = false;
        },
        toggle: function (e) {
            if (this.isShowing) {
                this.hide();
            } else {
                this.show();
            }
        },
        outsideClick: function (e) {
            var target = $(e.target);
            if (e.type == "focusin" || target.closest(this.element).length || target.closest(this.container).length || target.closest('.calendar-table').length)
                return;
            var isElementValueValidDate = false;
            try {
                isElementValueValidDate = moment(this.element.val(), this.locale.format).isValid();
            } catch (err){ }
            this.hide(isElementValueValidDate);
        },
        showCalendars: function () {
            this.container.addClass('show-calendar');
            this.move();
            this.element.trigger('showCalendar.daterangepicker', this);
        },
        hideCalendars: function () {
            this.container.removeClass('show-calendar');
            this.element.trigger('hideCalendar.daterangepicker', this);
        },
        hoverRange: function (e) {
            if (this.container.find('input[name=daterangepicker_start]').is(":focus") || this.container.find('input[name=daterangepicker_end]').is(":focus"))
                return;
            var label = e.target.innerHTML;
            if (label == this.locale.customRangeLabel) {
                this.updateView();
            } else {
                var dates = this.ranges[label];
                this.container.find('input[name=daterangepicker_start]').val(dates[0].format(this.locale.format));
                this.container.find('input[name=daterangepicker_end]').val(dates[1].format(this.locale.format));
            }
        },
        clickRange: function (e) {
            var label = e.target.innerHTML;
            this.chosenLabel = label;
            if (label == this.locale.customRangeLabel) {
                this.showCalendars();
            } else {
                var dates = this.ranges[label];
                this.startDate = dates[0];
                this.endDate = dates[1];
                if (!this.timePicker) {
                    this.startDate.startOf('day');
                    this.endDate.endOf('day');
                }
                this.hideCalendars();
                this.clickApply();
            }
        },
        clickPrev: function (e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.subtract(1, 'month');
                if (this.linkedCalendars)
                    this.rightCalendar.month.subtract(1, 'month');
            } else {
                this.rightCalendar.month.subtract(1, 'month');
            }
            this.updateCalendars();
        },
        clickNext: function (e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.add(1, 'month');
            } else {
                this.rightCalendar.month.add(1, 'month');
                if (this.linkedCalendars)
                    this.leftCalendar.month.add(1, 'month');
            }
            this.updateCalendars();
        },
        hoverDate: function (e) {
            if (this.container.find('input[name=daterangepicker_start]').is(":focus") || this.container.find('input[name=daterangepicker_end]').is(":focus"))
                return;
            if (!$(e.target).hasClass('available')) return;
            var title = $(e.target).attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents('.calendar');
            var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
            if (this.endDate) {
                this.container.find('input[name=daterangepicker_start]').val(date.format(this.locale.format));
            } else {
                this.container.find('input[name=daterangepicker_end]').val(date.format(this.locale.format));
            }
            var leftCalendar = this.leftCalendar;
            var rightCalendar = this.rightCalendar;
            var startDate = this.startDate;
            if (!this.endDate) {
                this.container.find('.calendar td').each(function (index, el) {
                    if ($(el).hasClass('week')) return;
                    var title = $(el).attr('data-title');
                    var row = title.substr(1, 1);
                    var col = title.substr(3, 1);
                    var cal = $(el).parents('.calendar');
                    var dt = cal.hasClass('left') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];
                    if (dt.isAfter(startDate) && dt.isBefore(date)) {
                        $(el).addClass('in-range');
                        $(el).next().addClass('selected-end')
                    } else {
                        $(el).removeClass('in-range');
                        $(el).next().removeClass('selected-end')
                    }
                });
            }
        },
        clickDate: function (e) {
            if (!$(e.target).hasClass('available')) return;
            var title = $(e.target).attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents('.calendar');
            var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
            if (this.endDate || date.isBefore(this.startDate, 'day')) {
                if (this.timePicker) {
                    var hour = parseInt(this.container.find('.left .hourselect').val(), 10);
                    if (!this.timePicker24Hour) {
                        var ampm = this.container.find('.left .ampmselect').val();
                        if (ampm === 'PM' && hour < 12)
                            hour += 12;
                        if (ampm === 'AM' && hour === 12)
                            hour = 0;
                    }
                    var minute = parseInt(this.container.find('.left .minuteselect').val(), 10);
                    var second = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0;
                    date = date.clone().hour(hour).minute(minute).second(second);
                }
                this.endDate = null;
                this.setStartDate(date.clone());
            } else if (!this.endDate && date.isBefore(this.startDate)) {
                this.setEndDate(this.startDate.clone());
            } else {
                if (this.timePicker) {
                    var hour = parseInt(this.container.find('.right .hourselect').val(), 10);
                    if (!this.timePicker24Hour) {
                        var ampm = this.container.find('.right .ampmselect').val();
                        if (ampm === 'PM' && hour < 12)
                            hour += 12;
                        if (ampm === 'AM' && hour === 12)
                            hour = 0;
                    }
                    var minute = parseInt(this.container.find('.right .minuteselect').val(), 10);
                    var second = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0;
                    date = date.clone().hour(hour).minute(minute).second(second);
                }
                this.setEndDate(date.clone());
                if (this.autoApply)
                    this.clickApply();
            }
            if (this.singleDatePicker) {
                this.setEndDate(this.startDate);
                if (!this.timePicker)
                    this.clickApply();
            }
            this.updateView();
        },
        clickApply: function (updateElement) {
            this.hide(updateElement);
            this.element.trigger('apply.daterangepicker', this);
        },
        clickCancel: function (e) {
            this.startDate = this.oldStartDate;
            this.endDate = this.oldEndDate;
            this.hide();
            this.element.trigger('cancel.daterangepicker', this);
        },
        monthOrYearChanged: function (e) {
            var jalaali = this.element.data().jalaali;
            var isLeft = $(e.target).closest('.calendar').hasClass('left'),
                leftOrRight = isLeft ? 'left' : 'right',
                cal = this.container.find('.calendar.' + leftOrRight);
            var month = parseInt(cal.find('.monthselect').val(), 10);
            var year = cal.find('.yearselect').val();

            var tmpDate;
            if (jalaali)
                tmpDate = moment(moment({ year: year, month: month, day: 1 }).format('YYYY/MM/DD'), this.locale.format).format(this.locale.format);
            else
                tmpDate = moment({ year: year, month: month, day: 1 }).format(this.locale.format);

            $(this.element).val(tmpDate).trigger('keyup');

            if (jalaali) {
                //console.log(month)
                //console.log(year)
                //var localDate = moment(year + '/' + month + '/15', 'jYYYY/jM/jD');
                //omid
                var localDate = moment(year + '/' + (month + 1), 'jYYYY/jM');
                month = localDate.month();
                year = localDate.year();
            }
            //console.log(month)
            //console.log(year)
            if (!isLeft) {
                if (year < this.startDate.year() || (year == this.startDate.year() && month < this.startDate.month())) {
                    month = this.startDate.month();
                    year = this.startDate.year();
                }
            }
            if (this.minDate) {
                //Omid
                var localDate = moment(year + '/' + (month + 1), 'jYYYY/jM/jD');
                var tmpMonth = localDate.month();
                var tmpYear = localDate.year();
                if (year < this.minDate.year() || (tmpYear == this.minDate.year() && tmpMonth < this.minDate.month())) {

                    month = this.minDate.month();
                    year = this.minDate.year();

                }
            }
            if (this.maxDate) {
                if (year > this.maxDate.year() || (year == this.maxDate.year() && month > this.maxDate.month())) {
                    month = this.maxDate.month();
                    year = this.maxDate.year();
                }
            }
            if (isLeft) {
                this.leftCalendar.month.month(month).year(year);
                if (this.linkedCalendars)
                    this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
            } else {
                this.rightCalendar.month.month(month).year(year);
                if (this.linkedCalendars)
                    this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
            }
            //console.log(this.rightCalendar.month)
            //console.log(this.leftCalendar.month)
            this.updateCalendars();
        },
        timeChanged: function (e) {
            var cal = $(e.target).closest('.calendar'),
                isLeft = cal.hasClass('left');
            var hour = parseInt(cal.find('.hourselect').val(), 10);
            var minute = parseInt(cal.find('.minuteselect').val(), 10);
            var second = this.timePickerSeconds ? parseInt(cal.find('.secondselect').val(), 10) : 0;
            if (!this.timePicker24Hour) {
                var ampm = cal.find('.ampmselect').val();
                if (ampm === 'PM' && hour < 12)
                    hour += 12;
                if (ampm === 'AM' && hour === 12)
                    hour = 0;
            }
            if (isLeft) {
                var start = this.startDate.clone();
                start.hour(hour);
                start.minute(minute);
                start.second(second);
                this.setStartDate(start);
                if (this.singleDatePicker) {
                    this.endDate = this.startDate.clone();
                } else if (this.endDate && this.endDate.format('YYYY-MM-DD') == start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
                    this.setEndDate(start.clone());
                }
            } else if (this.endDate) {
                var end = this.endDate.clone();
                end.hour(hour);
                end.minute(minute);
                end.second(second);
                this.setEndDate(end);
            }
            this.updateCalendars();
            this.updateFormInputs();
            this.renderTimePicker('left');
            this.renderTimePicker('right');
        },
        formInputsChanged: function (e) {
            var isRight = $(e.target).closest('.calendar').hasClass('right');
            var start = moment(this.container.find('input[name="daterangepicker_start"]').val(), this.locale.format);
            var end = moment(this.container.find('input[name="daterangepicker_end"]').val(), this.locale.format);
            if (start.isValid() && end.isValid()) {
                if (isRight && end.isBefore(start))
                    start = end.clone();
                this.setStartDate(start);
                this.setEndDate(end);
                if (isRight) {
                    this.container.find('input[name="daterangepicker_start"]').val(this.startDate.format(this.locale.format));
                } else {
                    this.container.find('input[name="daterangepicker_end"]').val(this.endDate.format(this.locale.format));
                }
            }
            this.updateCalendars();
            if (this.timePicker) {
                this.renderTimePicker('left');
                this.renderTimePicker('right');
            }
        },
        elementChanged: function () {

            if (!this.element.is('input')) return;
            if (!this.element.val().length) return;

            //omid
            var jLength = (this.locale.format.split("j").length - 1);
            if (this.element.val().length < this.locale.format.length - jLength) return;
            
            var dateString = this.element.val().split(this.locale.separator),
                start = null,
                end = null;
            if (dateString.length === 2) {
                start = moment(dateString[0], this.locale.format);
                end = moment(dateString[1], this.locale.format);
            }
            if (this.singleDatePicker || start === null || end === null) {
                start = moment(this.element.val(), this.locale.format);
                end = start;
            }
            if (!start.isValid() || !end.isValid()) return;

            this.setStartDate(start);
            this.setEndDate(end);
            this.updateView();
        },
        keydown: function (e) {
            if ((e.keyCode === 9) || (e.keyCode === 13)) {
                //omid
                var isElementValueValidDate = false;
                try {
                    isElementValueValidDate = moment(this.element.val(), this.locale.format).isValid();
                } catch (err){ }

                this.clickApply(isElementValueValidDate);
            }
        },
        updateElement: function () {
            if (this.element.is('input') && !this.singleDatePicker && this.autoUpdateInput) {
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
                this.element.trigger('change');
            } else if (this.element.is('input') && this.autoUpdateInput) {
                /*console.log*/('a', this.element.val())
                this.element.val(this.startDate.format(this.locale.format));
                //console.log('b', this.element.val())

                this.element.trigger('change');
            }
        },
        remove: function () {
            this.container.remove();
            this.element.off('.daterangepicker');
            this.element.removeData();
        },
    };
    $.fn.daterangepicker = function (options, callback) {
        this.each(function () {
            var el = $(this);
            if (el.data('daterangepicker'))
                el.data('daterangepicker').remove();
            el.data('daterangepicker', new DateRangePicker(el, options, callback));
        });
        return this;
    };
    return DateRangePicker;
}));