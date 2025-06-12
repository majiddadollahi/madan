var ccsDateRangePicker = {
    initAllDatepickers: function (selector) {
        selector = selector ? selector : '.jalali-datepicker';
        $.each($(selector), function (i, v) {
            ccsDateRangePicker.initDatepicker($(this));
        });
    },
    initDatepicker: function ($thisDatepicker) {
        $thisDatepicker = $($thisDatepicker);

        //set datepicker configurations
        var datePickerOption = generateDatePickerOption();
        setDatepickerFormats();

        //set null value
        if ($thisDatepicker.attr('value') == "")
            $thisDatepicker.val(undefined).change();

        //set mask
        setDatePickerMask();

        //focus on select
        if (datePickerOption.selectOnFocus) {
            $thisDatepicker.focus(function () {
                $thisDatepicker[0].select();
            });
        }

        //set by miladi date
        setMiladiInitValue();

        //add hidden fields and extra elements
        setHiddenElement();

        setDatePicker();

        makeDatePickerConvertable();

        function setMiladiInitValue() {
            if (datePickerOption.miladiInitValue) {
                var convertedValue = moment(datePickerOption.miladiInitValue, datePickerOption.miladiInitValueFormat)
                    .format(datePickerOption.displayFormat);
                $thisDatepicker.val(convertedValue)
            }
        }
        function setHiddenElement() {
            if (datePickerOption.hiddenOutputId || datePickerOption.hiddenOutputName) {
                var hiddenElement = $('#' + datePickerOption.hiddenOutputId);
                if (hiddenElement.length == 0 && datePickerOption.hiddenOutputName)
                    hiddenElement = $('[name="' + datePickerOption.hiddenOutputName + '"]');

                if (hiddenElement.length == 0) {
                    hiddenElement = document.createElement('input');
                    hiddenElement.setAttribute('type', 'hidden')
                    if (datePickerOption.hiddenOutputId)
                        hiddenElement.setAttribute('id', datePickerOption.hiddenOutputId)
                    if (datePickerOption.hiddenOutputName)
                        hiddenElement.setAttribute('name', datePickerOption.hiddenOutputName)
                    hiddenElement = $(hiddenElement);
                    $thisDatepicker.after(hiddenElement);
                }

                var selectedVal = $thisDatepicker.val();
                if (selectedVal) {
                    var value = moment(selectedVal, datePickerOption.displayFormat)
                        .format(datePickerOption.hiddenOutputFormat)
                    hiddenElement.val(value);
                }
            }
        }
        function setDatepickerFormats() {
            var jalaaliDateFormat = 'jYYYY/jMM/jDD';
            var miladiDateFormat = 'YYYY/MM/DD';
            var timeFormat = 'HH:mm';

            datePickerOption.displayFormat = datePickerOption.displayFormat ||
                (datePickerOption.jalaali ? jalaaliDateFormat : miladiDateFormat);
            $thisDatepicker.data("display-format", datePickerOption.displayFormat);


            datePickerOption.hiddenOutputFormat = datePickerOption.hiddenOutputFormat ||
                (datePickerOption.jalaali ? miladiDateFormat : jalaaliDateFormat);
            $thisDatepicker.data("hidden-output-format", datePickerOption.hiddenOutputFormat);

            if (datePickerOption.timePicker) {
                if (!datePickerOption.displayFormat.includes(timeFormat)) {
                    datePickerOption.displayFormat = datePickerOption.displayFormat + ' ' + timeFormat;
                }
                if (!datePickerOption.hiddenOutputFormat.includes(timeFormat)) {
                    datePickerOption.hiddenOutputFormat = datePickerOption.hiddenOutputFormat + ' ' + timeFormat;
                }
                if (!datePickerOption.miladiInitValueFormat.includes(timeFormat)) {
                    datePickerOption.miladiInitValueFormat = datePickerOption.miladiInitValueFormat + ' ' + timeFormat;
                }
            }
            datePickerOption.locale = { format: datePickerOption.displayFormat };

            $thisDatepicker.data("jalaali", datePickerOption.jalaali);

        }
        function setDatePickerMask() {
            if (datePickerOption.mask) {
                if (datePickerOption.timePicker && !datePickerOption.mask.includes(':'))
                    datePickerOption.mask += ' - 00:00'

                $thisDatepicker.mask(datePickerOption.mask);
            }
        }
        function generateDatePickerOption() {
            var options = {
                jalaali: true,
                timePicker: false,
                displayFormat: '',
                miladiInitValueFormat: "YYYY/MM/DD",
                hiddenOutputFormat: '',
                mask: '0000/00/00',
                selectOnFocus: true,
                dropdownMinYearOffset: 100,
                dropdownMaxYearOffset: 100,
                clearLabel: 'Clear',
                autoApply: true,
                opens: 'left',
                singleDatePicker: true,
                showDropdowns: true,
                convertable: false
            };
            var dataObj = $thisDatepicker.data();
            options = $.extend({}, options, dataObj);
            return options;
        }
        function runDataEventValues(attributeName) {
            var eventHandler = datePickerOption[attributeName];
            if (!eventHandler)
                return;
            eventHandler = '(' + eventHandler + ')()';
            eval(eventHandler);
        }
        function setDatePicker() {
            var initVal = $thisDatepicker.val();
            //datepicker init
            $thisDatepicker.daterangepicker(datePickerOption)
                //events
                .on('apply.daterangepicker', function () {
                    runDataEventValues('onApply');
                    if (datePickerOption.hiddenOutputId || datePickerOption.hiddenOutputName) {
                        var selectedVal = $thisDatepicker.val();

                        onApplyProcess(selectedVal);
                    }
                })
                .on('show.daterangepicker', function () {
                    runDataEventValues('onShow')
                })
                .on('hide.daterangepicker', function () {
                    runDataEventValues('onHide')
                })
                .on('showCalendar.daterangepicker', function () {
                    runDataEventValues('onShowCalendar')
                })
                .on('hideCalendar.daterangepicker', function () {
                    runDataEventValues('onHideCalendar')
                })
                .on('cancel.daterangepicker', function () {
                    runDataEventValues('onCancel')
                });


            $thisDatepicker.keyup(function (event) {
                onApplyProcess($(this).val());
            });

            function onApplyProcess(selectedVal) {
                var hiddenElementselector;
                if (datePickerOption.hiddenOutputId)
                    hiddenElementselector = '#' + datePickerOption.hiddenOutputId;
                else
                    hiddenElementselector = '[name="' + datePickerOption.hiddenOutputName + '"]';
                var hiddenElement = $(hiddenElementselector);
                if (hiddenElement.length == 0)
                    return;

                if (selectedVal.trim() == '') {
                    hiddenElement.val(null);
                    return;
                }

                var validInputLength = datePickerOption.displayFormat.replace(new RegExp('j', 'g'), '').length;
                if (selectedVal.length < validInputLength)
                    return;

                //If selected value is not empty and there is any hidden output
                //Convert selected value to hidden output format
                var convertedDate = moment(selectedVal, datePickerOption.displayFormat);
                if (convertedDate.isValid())
                    selectedVal = convertedDate.format(datePickerOption.hiddenOutputFormat);
                else
                    selectedVal = null;

                hiddenElement.val(selectedVal);
            }

            if (!initVal) {
                $thisDatepicker.val('');
            }
        }

        function makeDatePickerConvertable() {
            if (!datePickerOption.convertable) {
                return;
            }
            var currentCalenderId = $thisDatepicker.attr("id");
            var buttonCalenderConvertorId = "calenderConvertor_" + currentCalenderId
            var buttonCalenderConvertor = $("#" + buttonCalenderConvertorId);

            if (buttonCalenderConvertor.length > 0) {
                return;
            }

            var htmlElementComponentDatePicker = $('<div class="input-group"/>');
            var divInputGroupPrepend = $("<div class='input-group-prepend'/>");
            htmlElementComponentDatePicker.append(divInputGroupPrepend);

            var buttonCalenderConvertor = $('<span title="تغییر تقویم" style="cursor: pointer;"  class="input-group-addon cursor-pointer border"><i class="mdi mdi-calendar-sync-outline"></i></span>');

            buttonCalenderConvertor.data("calenderid", "#" + currentCalenderId);
            buttonCalenderConvertor.attr("id", buttonCalenderConvertorId);
            htmlElementComponentDatePicker.append(buttonCalenderConvertor);
            $thisDatepicker.after(htmlElementComponentDatePicker);
            htmlElementComponentDatePicker.prepend($thisDatepicker);

            buttonCalenderConvertor.on("click", function () {
                var currentCalender = $($(this).data("calenderid"));
                var currentCalenderDataObj = currentCalender.data();

                var miladyDate = '';
                var currentSeletedValue = currentCalender.val();
                if (currentSeletedValue) {
                    var currentDate = moment(currentSeletedValue, currentCalenderDataObj.displayFormat);
                    if (currentDate.isValid()) {
                        miladyDate = currentDate.format(datePickerOption.miladiInitValueFormat);
                    }
                }

                var isJalaali = currentCalenderDataObj.jalaali;

                var targetCalender = currentCalender.clone();
                targetCalender.data("jalaali", !isJalaali);
                targetCalender.data("hidden-output-format", currentCalenderDataObj.hiddenOutputFormat);
                if (miladyDate) {
                    targetCalender.data("miladi-init-value", miladyDate);
                }
                var newDisplayformat = ChangeDisplayFormat(currentCalenderDataObj);
                targetCalender.data("display-format", newDisplayformat);

                currentCalender.after(targetCalender);
                currentCalender.remove();

                ccsDateRangePicker.initDatepicker(targetCalender);
            });

            function ChangeDisplayFormat(currentCalenderDataObj) {
                var displayformat = currentCalenderDataObj.displayFormat;

                var separatoreRegx = new RegExp('[-\\_./]');
                var usedSeparatore = displayformat.match(separatoreRegx);

                if (!usedSeparatore) {
                    return displayformat;
                }

                var isJaalaliDispalyForamt = displayformat.includes('j');
                if (isJaalaliDispalyForamt) {
                    var miladyDispalyFormat = displayformat.replace(new RegExp('j', 'g'), '');
                    displayformat = miladyDispalyFormat;
                }
                else {
                    var jalaaliSeparatore = usedSeparatore + "j";
                    var usedSeparatorRegx = new RegExp(usedSeparatore, 'g')
                    var displayformat = displayformat.replace(usedSeparatorRegx, jalaaliSeparatore);
                    displayformat = "j" + displayformat;
                }
                return displayformat;
            }
        }
    }
}