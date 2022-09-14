$(document).ready(async function () {
    const apiUrl = 'http://web-calendar.test/php/?';
    const weekDays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    var currentDate = new Date();
    console.log(currentDate);
    function generateCalendar(d) {
        function monthDays(month, year) {
            var result = [];
            var days = new Date(year, month, 0).getDate();
            for (var i = 1; i <= days; i++) {
                result.push(i);
            }
            return result;
        }
        Date.prototype.monthDays = function () {
            var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
            return d.getDate();
        };
        var details = {
            // totalDays: monthDays(d.getMonth(), d.getFullYear()),
            totalDays: d.monthDays(),
            weekDays: weekDays,
            months: months
        };
        var start = new Date(d.getFullYear(), d.getMonth()).getDay();
        var cal = [];
        var day = 1;
        for (var i = 0; i <= 6; i++) {
            cal.push(['<tr>']);
            for (var j = 0; j < 7; j++) {
                if (i === 0) {
                    cal[i].push('<td>' + details.weekDays[j] + '</td>');
                } else if (day > details.totalDays) {
                    cal[i].push('<td>&nbsp;</td>');
                } else {
                    if (i === 1 && j < start) {
                        cal[i].push('<td>&nbsp;</td>');
                    } else {
                        cal[i].push('<td class="day" data-day="'+ day +'">' + day++ + '</td>');
                    }
                }
            }
            cal[i].push('</tr>');
        }
        cal = cal
            .reduce(function (a, b) {
                return a.concat(b);
            }, [])
            .join('');
        $('table').append(cal);
        $('#month').text(details.months[d.getMonth()]);
        $('#year').text(d.getFullYear());
        $('td.day')
            .mouseover(function () {
                $(this).addClass('hover');
            })
            .mouseout(function () {
                $(this).removeClass('hover');
            });
    }
    $('#left').click(function () {
        $('table').text('');
        if (currentDate.getMonth() === 0) {
            currentDate = new Date(currentDate.getFullYear() - 1, 11);
            generateCalendar(currentDate);
        } else {
            currentDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 1
            );
            generateCalendar(currentDate);
        }
    });
    $('#right').click(function () {
        $('table').html('<tr></tr>');
        if (currentDate.getMonth() === 11) {
            currentDate = new Date(currentDate.getFullYear() + 1, 0);
            generateCalendar(currentDate);
        } else {
            currentDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1
            );
            generateCalendar(currentDate);
        }
    });
    generateCalendar(currentDate);

    function buildFormattedDate(selectedDate) {
        let year = selectedDate.getFullYear();
        let month = selectedDate.getMonth() + 1;
        let monthOut = month < 10 ? '0' + month : month;
        let day = selectedDate.getDate() < 10 ? '0' + selectedDate.getDate() : selectedDate.getDate();

        return year + '-' + monthOut + '-' + day;
    }

    function closePopup() {
        $('.popup-text').empty();
        $('.delete-event').remove();
        $('.open-edit-event').remove();
        $('.edit-event-input').remove();
        $('.save-edit-event').remove();
        $('.close-edit-event').remove();
        $('.popup-content').removeClass('active');
        $('.popup-overlay .input-form').removeClass('active');
    }

    function closeEditForm(id) {
        $('#input-edit' + id).remove();
        $('#save-edit' + id).remove();
        $('#close-edit' + id).remove();
        $('#edit-form' + id).removeClass('active');
    }

    $('.popup-close').on('click', function () {
        closePopup();
    });

    $('.popup-add').on('click', function () {
        $('.popup-overlay .input-form').addClass('active');
    });

    $('.popup-overlay .close-form').on('click', function () {
        $('.popup-overlay .input-form').removeClass('active');
    });

    // load events for clicked date
    $('.table').on('click', '.day', async function (event) {
        event.preventDefault();
        if (!$('.popup-content').hasClass('active')) {
            let formattedDate = buildFormattedDate(new Date(
                $('#month').text() + $(this).attr('data-day') + ', ' + $('#year').text()
            ));
            let promise = await fetch(apiUrl + 'method=getEventsForDate&date=' + formattedDate);
            let result = await promise.json();
            if (result.result === 'ok') {
                result.data.forEach(function (item) {
                    if (item.id) {
                        let out = item.id + ': ' + item.description;
                        $('.popup-data').append(
                            '<p class="popup-text">' + out + '</p>' +
                            '<button class="open-edit-event" id="open-edit' + item.id + '">Edit event</button>' +
                            '<div class="edit-form" id="edit-form' + item.id + '"></div>' +
                            '<button class="delete-event" id="event' + item.id + '">Delete event</button>'
                        );
                    }
                });
            }
            $('.popup-header').text(formattedDate);
            $('.popup-content').addClass('active');
        } else {
            closePopup();
        }
    });

    // open edit form for event
    $('.popup-overlay .popup-content .popup-data').on('click', '.open-edit-event', function () {
        let id = $(this).attr('id').substring(9, $(this).attr('id').length);
        if (!$('#edit-form' + id).hasClass('active')) {
            $('#edit-form' + id).addClass('active');
            $('#edit-form' + id).append(
                '<input class="edit-event-input" type="text" id="input-edit' + id + '">' +
                '<button class="save-edit-event" id="save-edit' + id + '">Save</button>' +
                '<button class="close-edit-event" id="close-edit' + id + '">Close</button>'
            );
        }
        else {
            closeEditForm(id);
        }
    });

    // close edit form
    $('.popup-data').on('click', '.close-edit-event', function () {
        let id = $(this).attr('id').substring(10, $(this).attr('id').length);
        closeEditForm(id);
    });

    // save edited event
    $('.popup-data').on('click', '.edit-form .save-edit-event', async function (event) {
        event.preventDefault();
        let description = $('.edit-event-input').val();
        let id = $(this).attr('id').substring(9, $(this).attr('id').length);
        let promise = await fetch(apiUrl + 'method=editEvent&id=' + id + '&description=' + description);
        let result = await promise.json();
        if (!result.data.error && !result.error) {
            location.reload();
        } else {
            alert('something went wrong...');
        }
    });

    // delete selected event
    $('.popup-data').on('click', '.delete-event', async function (event) {
        event.preventDefault();
        let id = $(this).attr('id').substring(5, $(this).attr('id').length);
        let promise = await fetch(apiUrl + 'method=deleteEvent&id=' + id);
        let result = await promise.json();
        if (!result.data.error && !result.error) {
            location.reload();
        } else {
            alert('something went wrong...');
        }
    });

    // add new event
    $('#add-event').on('submit', async function (event) {
        event.preventDefault();
        if ($('#date').val() === '') {
            alert('form is filled incorrectly!');
        } else {
            let date = $('#date').val();
            let description = $('#description').val();
            let promise = await fetch(
                apiUrl + 'method=addEventForDate&date=' + date + '&description=' + description
            );
            let result = await promise.json();
            if (!result.data.error && !result.error) {
                location.reload();
            } else {
                alert('something went wrong...');
            }
        }
    });
});
