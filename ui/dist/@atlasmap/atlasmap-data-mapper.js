import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, Directive, ElementRef, EventEmitter, Host, HostBinding, HostListener, Inject, Injectable, Injector, Input, NgModule, NgZone, Output, ReflectiveInjector, Renderer2, TemplateRef, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation, forwardRef, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Headers, Http, HttpModule } from '@angular/http';
import { FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { Observable as Observable$1 } from 'rxjs/Observable';
import { distinctUntilChanged as distinctUntilChanged$1 } from 'rxjs/operator/distinctUntilChanged';
import { map as map$1 } from 'rxjs/operator/map';
import { BehaviorSubject as BehaviorSubject$1 } from 'rxjs/BehaviorSubject';
import { observeOn as observeOn$1 } from 'rxjs/operator/observeOn';
import { scan as scan$1 } from 'rxjs/operator/scan';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { Subject as Subject$1 } from 'rxjs/Subject';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin';
import { DomSanitizer } from '@angular/platform-browser';

function zeroFill(num, targetLength, forceSign) {
    var absNumber = "" + Math.abs(num);
    var zerosToFill = targetLength - absNumber.length;
    var sign = num >= 0;
    return ((sign ? (forceSign ? '+' : '') : '-') +
        Math.pow(10, Math.max(0, zerosToFill))
            .toString()
            .substr(1) +
        absNumber);
}

function absFloor(number) {
    return number < 0 ? Math.ceil(number) || 0 : Math.floor(number);
}
function createUTCDate(y, m, d, h, M, s, ms) {
    var date = new Date(Date.UTC.apply(null, arguments));
    // the Date.UTC function remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
    }
    return date;
}

function isDateValid(date) {
    return date && !isNaN(date.getTime());
}
function isFunction(fn) {
    return (fn instanceof Function ||
        Object.prototype.toString.call(fn) === '[object Function]');
}
function isArray(input) {
    return (input instanceof Array ||
        Object.prototype.toString.call(input) === '[object Array]');
}
function hasOwnProp(a /*object*/, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}
function isObject(input /*object*/) {
    // IE8 will treat undefined and null as object if it wasn't for
    // input != null
    return (input != null && Object.prototype.toString.call(input) === '[object Object]');
}
function isUndefined(input) {
    return input === void 0;
}
function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion;
    var value = 0;
    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
    }
    return value;
}

var formatFunctions = {};
var formatTokenFunctions = {};
// tslint:disable-next-line
var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken(token, padded, ordinal, callback) {
    var func = callback;
    if (token) {
        formatTokenFunctions[token] = func;
    }
    if (padded) {
        var key = padded[0];
        formatTokenFunctions[key] = function (date, format, locale) {
            return zeroFill(func.apply(null, arguments), padded[1], padded[2]);
        };
    }
    if (ordinal) {
        formatTokenFunctions[ordinal] = function (date, format, locale) {
            // todo: fix this
            return locale.ordinal(func.apply(null, arguments), token);
        };
    }
}
function makeFormatFunction(format) {
    var array = format.match(formattingTokens);
    var length = array.length;
    var formatArr = new Array(length);
    for (var i = 0; i < length; i++) {
        formatArr[i] = formatTokenFunctions[array[i]]
            ? formatTokenFunctions[array[i]]
            : removeFormattingTokens(array[i]);
    }
    return function (date, locale) {
        var output = '';
        for (var j = 0; j < length; j++) {
            output += isFunction(formatArr[j])
                ? formatArr[j].call(null, date, format, locale)
                : formatArr[j];
        }
        return output;
    };
}
function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
}

var defaultTimeUnit = {
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    seconds: 0
};
function createDate(year, month, day, hour, minute, seconds) {
    if (month === void 0) { month = 0; }
    if (day === void 0) { day = 1; }
    if (hour === void 0) { hour = 0; }
    if (minute === void 0) { minute = 0; }
    if (seconds === void 0) { seconds = 0; }
    var _date = new Date();
    return new Date(year || _date.getFullYear(), month, day, hour, minute, seconds);
}
function shiftDate(date, unit) {
    var _unit = Object.assign({}, defaultTimeUnit, unit);
    return createDate(date.getFullYear() + _unit.year, date.getMonth() + _unit.month, date.getDate() + _unit.day, date.getHours() + _unit.hour, date.getMinutes() + _unit.minute, date.getSeconds() + _unit.seconds);
}
function setDate(date, unit) {
    return createDate(getNum(date.getFullYear(), unit.year), getNum(date.getMonth(), unit.month), getNum(date.getDate(), unit.day), getNum(date.getHours(), unit.hour), getNum(date.getMinutes(), unit.minute), getNum(date.getSeconds(), unit.seconds));
}
function getNum(def, num) {
    return typeof num === 'number' ? num : def;
}

function getHours(date, isUTC) {
    if (isUTC === void 0) { isUTC = false; }
    return isUTC ? date.getUTCHours() : date.getHours();
}
function getMinutes(date, isUTC) {
    if (isUTC === void 0) { isUTC = false; }
    return isUTC ? date.getUTCMinutes() : date.getMinutes();
}
function getSeconds(date, isUTC) {
    if (isUTC === void 0) { isUTC = false; }
    return isUTC ? date.getUTCSeconds() : date.getSeconds();
}
function getDayOfWeek(date, isUTC) {
    if (isUTC === void 0) { isUTC = false; }
    return isUTC ? date.getUTCDay() : date.getDay();
}
function getDate(date, isUTC) {
    if (isUTC === void 0) { isUTC = false; }
    return isUTC ? date.getUTCDate() : date.getDate();
}
function getMonth(date, isUTC) {
    if (isUTC === void 0) { isUTC = false; }
    return isUTC ? date.getUTCMonth() : date.getMonth();
}
function getFullYear(date, isUTC) {
    if (isUTC === void 0) { isUTC = false; }
    return isUTC ? date.getUTCFullYear() : date.getFullYear();
}
function getFirstDayOfMonth(date) {
    return createDate(date.getFullYear(), date.getMonth(), 1, date.getHours(), date.getMinutes(), date.getSeconds());
}


function isFirstDayOfWeek(date, firstDayOfWeek) {
    return date.getDay() === firstDayOfWeek;
}
function isSameMonth(date1, date2) {
    if (!date1 || !date2) {
        return false;
    }
    return isSameYear(date1, date2) && getMonth(date1) === getMonth(date2);
}
function isSameYear(date1, date2) {
    if (!date1 || !date2) {
        return false;
    }
    return getFullYear(date1) === getFullYear(date2);
}
function isSameDay(date1, date2) {
    if (!date1 || !date2) {
        return false;
    }
    return (isSameYear(date1, date2) &&
        isSameMonth(date1, date2) &&
        getDate(date1) === getDate(date2));
}

// FORMATTING
function getYear(date) {
    return getFullYear(date).toString();
}
addFormatToken('Y', null, null, function (date) {
    var y = getFullYear(date);
    return y <= 9999 ? '' + y : '+' + y;
});
addFormatToken(null, ['YY', 2], null, function (date) {
    return (getFullYear(date) % 100).toString(10);
});
addFormatToken(null, ['YYYY', 4], null, getYear);
addFormatToken(null, ['YYYYY', 5], null, getYear);
addFormatToken(null, ['YYYYYY', 6, true], null, getYear);
function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function startOf(date, units) {
    var unit = getDateShift(units);
    return setDate(date, unit);
}
function endOf(date, units) {
    var start = startOf(date, units);
    var shift = (_a = {}, _a[units] = 1, _a);
    var change = shiftDate(start, shift);
    change.setMilliseconds(-1);
    return change;
    var _a;
}
function getDateShift(units) {
    var unit = {};
    switch (units) {
        case 'year':
            unit.month = 0;
        /* falls through */
        case 'month':
            unit.day = 1;
        /* falls through */
        case 'week':
        case 'day':
            unit.hour = 0;
        /* falls through */
        case 'hour':
            unit.minute = 0;
        /* falls through */
        case 'minute':
            unit.seconds = 0;
    }
    return unit;
}

// FORMATTING
addFormatToken('DDD', ['DDDD', 3], 'DDDo', function (date) {
    return getDayOfYear(date).toString(10);
});
function getDayOfYear(date) {
    var date1 = +startOf(date, 'day');
    var date2 = +startOf(date, 'year');
    var someDate = date1 - date2;
    var oneDay = 1000 * 60 * 60 * 24;
    return Math.round(someDate / oneDay) + 1;
}

/**
 *
 * @param {number} year
 * @param {number} dow - start-of-first-week
 * @param {number} doy - start-of-year
 * @returns {number}
 */
function firstWeekOffset(year, dow, doy) {
    // first-week day -- which january is always in the first week (4 for iso, 1 for other)
    var fwd = 7 + dow - doy;
    // first-week day local weekday -- which local weekday is fwd
    var fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;
    return -fwdlw + fwd - 1;
}
// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday

function weekOfYear(date, dow, doy) {
    var weekOffset = firstWeekOffset(getFullYear(date), dow, doy);
    var week = Math.floor((getDayOfYear(date) - weekOffset - 1) / 7) + 1;
    var resWeek;
    var resYear;
    if (week < 1) {
        resYear = getFullYear(date) - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
    }
    else if (week > weeksInYear(getFullYear(date), dow, doy)) {
        resWeek = week - weeksInYear(getFullYear(date), dow, doy);
        resYear = getFullYear(date) + 1;
    }
    else {
        resYear = getFullYear(date);
        resWeek = week;
    }
    return {
        week: resWeek,
        year: resYear
    };
}
function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy);
    var weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
}

var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
var defaultLongDateFormat = {
    LTS: 'h:mm:ss A',
    LT: 'h:mm A',
    L: 'MM/DD/YYYY',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY h:mm A',
    LLLL: 'dddd, MMMM D, YYYY h:mm A'
};
var Locale = (function () {
    function Locale(config) {
        if (!!config) {
            this.set(config);
        }
    }
    Locale.prototype.set = function (config) {
        for (var i in config) {
            if (!config.hasOwnProperty(i)) {
                continue;
            }
            var prop = config[i];
            var key = isFunction(prop) ? i : "_" + i;
            this[key] = prop;
        }
        this._config = config;
    };
    // Months
    // LOCALES
    Locale.prototype.months = function (date, format) {
        if (!date) {
            return isArray(this._months)
                ? this._months
                : this._months.standalone;
        }
        if (isArray(this._months)) {
            return this._months[getMonth(date)];
        }
        var key = (this._months.isFormat ||
            MONTHS_IN_FORMAT)
            .test(format)
            ? 'format'
            : 'standalone';
        return this._months[key][getMonth(date)];
    };
    Locale.prototype.monthsShort = function (date, format) {
        if (!date) {
            return isArray(this._monthsShort)
                ? this._monthsShort
                : this._monthsShort.standalone;
        }
        if (isArray(this._monthsShort)) {
            return this._monthsShort[getMonth(date)];
        }
        var key = MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone';
        return this._monthsShort[key][getMonth(date)];
    };
    // Days of week
    // LOCALES
    Locale.prototype.weekdays = function (date, format) {
        var _isArray = isArray(this._weekdays);
        if (!date) {
            return _isArray
                ? this._weekdays
                : this._weekdays.standalone;
        }
        if (_isArray) {
            return this._weekdays[getDayOfWeek(date)];
        }
        var _key = this._weekdays.isFormat.test(format)
            ? 'format'
            : 'standalone';
        return this._weekdays[_key][getDayOfWeek(date)];
    };
    Locale.prototype.weekdaysMin = function (date) {
        return date ? this._weekdaysShort[getDayOfWeek(date)] : this._weekdaysShort;
    };
    Locale.prototype.weekdaysShort = function (date) {
        return date ? this._weekdaysMin[getDayOfWeek(date)] : this._weekdaysMin;
    };
    Locale.prototype.week = function (date) {
        return weekOfYear(date, this._week.dow, this._week.doy).week;
    };
    Locale.prototype.firstDayOfWeek = function () {
        return this._week.dow;
    };
    Locale.prototype.firstDayOfYear = function () {
        return this._week.doy;
    };
    Locale.prototype.meridiem = function (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        }
        return isLower ? 'am' : 'AM';
    };
    Locale.prototype.ordinal = function (num, token) {
        return this._ordinal.replace('%d', num.toString(10));
    };
    Locale.prototype.preparse = function (str) {
        return str;
    };
    Locale.prototype.postformat = function (str) {
        return str;
    };
    Locale.prototype.formatLongDate = function (key) {
        this._longDateFormat = this._longDateFormat ? this._longDateFormat : defaultLongDateFormat;
        var format = this._longDateFormat[key];
        var formatUpper = this._longDateFormat[key.toUpperCase()];
        if (format || !formatUpper) {
            return format;
        }
        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });
        return this._longDateFormat[key];
    };
    return Locale;
}());

var defaultInvalidDate = 'Invalid date';
var defaultLocaleWeek = {
    dow: 0,
    doy: 6 // The week that contains Jan 1st is the first week of the year.
};
var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
var baseConfig = {
    // calendar: defaultCalendar,
    // longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    // ordinal: defaultOrdinal,
    // dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
    // relativeTime: defaultRelativeTime,
    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,
    week: defaultLocaleWeek,
    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultLocaleWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,
    meridiemParse: defaultLocaleMeridiemParse
};

// internal storage for locale config files
var locales = {};
var localeFamilies = {};
var globalLocale;
function chooseLocale(name) {
    return locales[name];
}
// returns locale data
function getLocale(key) {
    if (!key) {
        return globalLocale;
    }
    return chooseLocale(key);
}

function mergeConfigs(parentConfig, childConfig) {
    var res = Object.assign({}, parentConfig);
    for (var childProp in childConfig) {
        if (!hasOwnProp(childConfig, childProp)) {
            continue;
        }
        if (isObject(parentConfig[childProp]) && isObject(childConfig[childProp])) {
            res[childProp] = {};
            Object.assign(res[childProp], parentConfig[childProp]);
            Object.assign(res[childProp], childConfig[childProp]);
        }
        else if (childConfig[childProp] != null) {
            res[childProp] = childConfig[childProp];
        }
        else {
            delete res[childProp];
        }
    }
    for (var parentProp in parentConfig) {
        if (hasOwnProp(parentConfig, parentProp) &&
            !hasOwnProp(childConfig, parentProp) &&
            isObject(parentConfig[parentProp])) {
            // make sure changes to properties don't modify parent config
            res[parentProp] = Object.assign({}, res[parentProp]);
        }
    }
    return res;
}
// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale(key, values) {
    var data;
    if (key) {
        data = isUndefined(values) ? getLocale(key) : defineLocale(key, values);
        if (data) {
            globalLocale = data;
        }
    }
    return globalLocale._abbr;
}
function defineLocale(name, config) {
    if (config === null) {
        // useful for testing
        delete locales[name];
        return null;
    }
    config.abbr = name;
    locales[name] = new Locale(mergeConfigs(baseConfig, config));
    if (localeFamilies[name]) {
        localeFamilies[name].forEach(function (x) {
            defineLocale(x.name, x.config);
        });
    }
    // backwards compat for now: also set the locale
    // make sure we set the locale AFTER all child locales have been
    // created, so we won't end up with the child locale set.
    getSetGlobalLocale(name);
    return locales[name];
}

/*tslint:disable */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * JS version of browser APIs. This library can only run in the browser.
 */
var win = (typeof window !== 'undefined' && window) || {};
var document$1 = win.document;
var location = win.location;
var gc = win['gc'] ? function () { return win['gc'](); } : function () { return null; };
var performance = win['performance'] ? win['performance'] : null;
var Event = win['Event'];
var MouseEvent = win['MouseEvent'];
var KeyboardEvent = win['KeyboardEvent'];
var EventTarget = win['EventTarget'];
var History = win['History'];
var Location = win['Location'];
var EventListener = win['EventListener'];

var guessedVersion;
function _guessBsVersion() {
    if (typeof document === 'undefined') {
        return null;
    }
    var spanEl = document.createElement('span');
    spanEl.innerText = 'test bs version';
    document.body.appendChild(spanEl);
    spanEl.classList.add('d-none');
    var rect = spanEl.getBoundingClientRect();
    document.body.removeChild(spanEl);
    if (!rect) {
        return 'bs3';
    }
    return rect.top === 0 ? 'bs4' : 'bs3';
}

// todo: in ngx-bootstrap, bs4 will became a default one
function isBs3() {
    if (typeof win === 'undefined') {
        return true;
    }
    if (typeof win.__theme === 'undefined') {
        if (guessedVersion) {
            return guessedVersion === 'bs3';
        }
        guessedVersion = _guessBsVersion();
        return guessedVersion === 'bs3';
    }
    return win.__theme !== 'bs4';
}

/**
 * Configuration service, provides default values for the AccordionComponent.
 */
var AccordionConfig = (function () {
    function AccordionConfig() {
        /** Whether the other panels should be closed when a panel is opened */
        this.closeOthers = false;
    }
    AccordionConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AccordionConfig.ctorParameters = function () { return []; };
    return AccordionConfig;
}());

/** Displays collapsible content panels for presenting information in a limited amount of space. */
var AccordionComponent = (function () {
    function AccordionComponent(config) {
        this.groups = [];
        Object.assign(this, config);
    }
    AccordionComponent.prototype.closeOtherPanels = function (openGroup) {
        if (!this.closeOthers) {
            return;
        }
        this.groups.forEach(function (group) {
            if (group !== openGroup) {
                group.isOpen = false;
            }
        });
    };
    AccordionComponent.prototype.addGroup = function (group) {
        this.groups.push(group);
    };
    AccordionComponent.prototype.removeGroup = function (group) {
        var index = this.groups.indexOf(group);
        if (index !== -1) {
            this.groups.splice(index, 1);
        }
    };
    AccordionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'accordion',
                    template: "<ng-content></ng-content>",
                    host: {
                        '[attr.aria-multiselectable]': 'closeOthers',
                        role: 'tablist',
                        class: 'panel-group',
                        style: 'display: block'
                    }
                },] },
    ];
    /** @nocollapse */
    AccordionComponent.ctorParameters = function () { return [
        { type: AccordionConfig, },
    ]; };
    AccordionComponent.propDecorators = {
        'closeOthers': [{ type: Input },],
    };
    return AccordionComponent;
}());

/**
 * ### Accordion heading
 * Instead of using `heading` attribute on the `accordion-group`, you can use
 * an `accordion-heading` attribute on `any` element inside of a group that
 * will be used as group's header template.
 */
var AccordionPanelComponent = (function () {
    function AccordionPanelComponent(accordion) {
        /** Emits when the opened state changes */
        this.isOpenChange = new EventEmitter();
        this._isOpen = false;
        this.accordion = accordion;
    }
    Object.defineProperty(AccordionPanelComponent.prototype, "isOpen", {
        // Questionable, maybe .panel-open should be on child div.panel element?
        /** Is accordion group open or closed. This property supports two-way binding */
        get: function () {
            return this._isOpen;
        },
        set: function (value) {
            var _this = this;
            if (value !== this.isOpen) {
                if (value) {
                    this.accordion.closeOtherPanels(this);
                }
                this._isOpen = value;
                Promise.resolve(null).then(function () {
                    _this.isOpenChange.emit(value);
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccordionPanelComponent.prototype, "isBs3", {
        get: function () {
            return isBs3();
        },
        enumerable: true,
        configurable: true
    });
    AccordionPanelComponent.prototype.ngOnInit = function () {
        this.panelClass = this.panelClass || 'panel-default';
        this.accordion.addGroup(this);
    };
    AccordionPanelComponent.prototype.ngOnDestroy = function () {
        this.accordion.removeGroup(this);
    };
    AccordionPanelComponent.prototype.toggleOpen = function (event) {
        if (!this.isDisabled) {
            this.isOpen = !this.isOpen;
        }
    };
    AccordionPanelComponent.decorators = [
        { type: Component, args: [{
                    selector: 'accordion-group, accordion-panel',
                    template: "<div class=\"panel card\" [ngClass]=\"panelClass\"> <div class=\"panel-heading card-header\" role=\"tab\" (click)=\"toggleOpen($event)\"> <div class=\"panel-title\"> <div role=\"button\" class=\"accordion-toggle\" [attr.aria-expanded]=\"isOpen\"> <div *ngIf=\"heading\" [ngClass]=\"{'text-muted': isDisabled}\"> {{ heading }} </div> <ng-content select=\"[accordion-heading]\"></ng-content> </div> </div> </div> <div class=\"panel-collapse collapse\" role=\"tabpanel\" [collapse]=\"!isOpen\"> <div class=\"panel-body card-block card-body\"> <ng-content></ng-content> </div> </div> </div> ",
                    host: {
                        class: 'panel',
                        style: 'display: block'
                    }
                },] },
    ];
    /** @nocollapse */
    AccordionPanelComponent.ctorParameters = function () { return [
        { type: AccordionComponent, decorators: [{ type: Inject, args: [AccordionComponent,] },] },
    ]; };
    AccordionPanelComponent.propDecorators = {
        'heading': [{ type: Input },],
        'panelClass': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'isOpenChange': [{ type: Output },],
        'isOpen': [{ type: HostBinding, args: ['class.panel-open',] }, { type: Input },],
    };
    return AccordionPanelComponent;
}());

// todo: add animations when https://github.com/angular/angular/issues/9947 solved
var CollapseDirective = (function () {
    function CollapseDirective(_el, _renderer) {
        this._el = _el;
        this._renderer = _renderer;
        /** This event fires as soon as content collapses */
        this.collapsed = new EventEmitter();
        /** This event fires as soon as content becomes visible */
        this.expanded = new EventEmitter();
        // shown
        this.isExpanded = true;
        // hidden
        this.isCollapsed = false;
        // stale state
        this.isCollapse = true;
        // animation state
        this.isCollapsing = false;
    }
    Object.defineProperty(CollapseDirective.prototype, "collapse", {
        get: function () {
            return this.isExpanded;
        },
        /** A flag indicating visibility of content (shown or hidden) */
        set: function (value) {
            this.isExpanded = value;
            this.toggle();
        },
        enumerable: true,
        configurable: true
    });
    /** allows to manually toggle content visibility */
    CollapseDirective.prototype.toggle = function () {
        if (this.isExpanded) {
            this.hide();
        }
        else {
            this.show();
        }
    };
    /** allows to manually hide content */
    CollapseDirective.prototype.hide = function () {
        this.isCollapse = false;
        this.isCollapsing = true;
        this.isExpanded = false;
        this.isCollapsed = true;
        this.isCollapse = true;
        this.isCollapsing = false;
        this.display = 'none';
        this.collapsed.emit(this);
    };
    /** allows to manually show collapsed content */
    CollapseDirective.prototype.show = function () {
        this.isCollapse = false;
        this.isCollapsing = true;
        this.isExpanded = true;
        this.isCollapsed = false;
        this.display = 'block';
        // this.height = 'auto';
        this.isCollapse = true;
        this.isCollapsing = false;
        this._renderer.setStyle(this._el.nativeElement, 'overflow', 'visible');
        this._renderer.setStyle(this._el.nativeElement, 'height', 'auto');
        this.expanded.emit(this);
    };
    CollapseDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[collapse]',
                    exportAs: 'bs-collapse',
                    host: {
                        '[class.collapse]': 'true'
                    }
                },] },
    ];
    /** @nocollapse */
    CollapseDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Renderer2, },
    ]; };
    CollapseDirective.propDecorators = {
        'collapsed': [{ type: Output },],
        'expanded': [{ type: Output },],
        'display': [{ type: HostBinding, args: ['style.display',] },],
        'isExpanded': [{ type: HostBinding, args: ['class.in',] }, { type: HostBinding, args: ['class.show',] }, { type: HostBinding, args: ['attr.aria-expanded',] },],
        'isCollapsed': [{ type: HostBinding, args: ['attr.aria-hidden',] },],
        'isCollapse': [{ type: HostBinding, args: ['class.collapse',] },],
        'isCollapsing': [{ type: HostBinding, args: ['class.collapsing',] },],
        'collapse': [{ type: Input },],
    };
    return CollapseDirective;
}());

var AlertConfig = (function () {
    function AlertConfig() {
        /** default alert type */
        this.type = 'warning';
        /** is alerts are dismissible by default */
        this.dismissible = false;
        /** default time before alert will dismiss */
        this.dismissOnTimeout = undefined;
    }
    AlertConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AlertConfig.ctorParameters = function () { return []; };
    return AlertConfig;
}());

/*tslint:disable:no-invalid-this */
function OnChange(defaultValue) {
    var sufix = 'Change';
    return function OnChangeHandler(target, propertyKey) {
        var _key = " __" + propertyKey + "Value";
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return this[_key];
            },
            set: function (value) {
                var prevValue = this[_key];
                this[_key] = value;
                if (prevValue !== value && this[propertyKey + sufix]) {
                    this[propertyKey + sufix].emit(value);
                }
            }
        });
    };
}
/* tslint:enable */

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AlertComponent = (function () {
    function AlertComponent(_config, changeDetection) {
        var _this = this;
        this.changeDetection = changeDetection;
        /** Alert type.
         * Provides one of four bootstrap supported contextual classes:
         * `success`, `info`, `warning` and `danger`
         */
        this.type = 'warning';
        /** If set, displays an inline "Close" button */
        this.dismissible = false;
        /** Is alert visible */
        this.isOpen = true;
        /** This event fires immediately after close instance method is called,
         * $event is an instance of Alert component.
         */
        this.onClose = new EventEmitter();
        /** This event fires when alert closed, $event is an instance of Alert component */
        this.onClosed = new EventEmitter();
        this.classes = '';
        this.dismissibleChange = new EventEmitter();
        Object.assign(this, _config);
        this.dismissibleChange.subscribe(function (dismissible) {
            _this.classes = _this.dismissible ? 'alert-dismissible' : '';
            _this.changeDetection.markForCheck();
        });
    }
    AlertComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.dismissOnTimeout) {
            // if dismissOnTimeout used as attr without binding, it will be a string
            setTimeout(function () { return _this.close(); }, parseInt(this.dismissOnTimeout, 10));
        }
    };
    // todo: animation ` If the .fade and .in classes are present on the element,
    // the alert will fade out before it is removed`
    /**
     * Closes an alert by removing it from the DOM.
     */
    AlertComponent.prototype.close = function () {
        if (!this.isOpen) {
            return;
        }
        this.onClose.emit(this);
        this.isOpen = false;
        this.changeDetection.markForCheck();
        this.onClosed.emit(this);
    };
    AlertComponent.decorators = [
        { type: Component, args: [{
                    selector: 'alert,bs-alert',
                    template: "<ng-template [ngIf]=\"isOpen\"> <div [class]=\"'alert alert-' + type\" role=\"alert\" [ngClass]=\"classes\"> <ng-template [ngIf]=\"dismissible\"> <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"close()\"> <span aria-hidden=\"true\">&times;</span> <span class=\"sr-only\">Close</span> </button> </ng-template> <ng-content></ng-content> </div> </ng-template> ",
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    AlertComponent.ctorParameters = function () { return [
        { type: AlertConfig, },
        { type: ChangeDetectorRef, },
    ]; };
    AlertComponent.propDecorators = {
        'type': [{ type: Input },],
        'dismissible': [{ type: Input },],
        'dismissOnTimeout': [{ type: Input },],
        'isOpen': [{ type: Input },],
        'onClose': [{ type: Output },],
        'onClosed': [{ type: Output },],
    };
    __decorate([
        OnChange(),
        __metadata("design:type", Object)
    ], AlertComponent.prototype, "dismissible", void 0);
    return AlertComponent;
}());

// tslint:disable:no-use-before-declare
// TODO: config: activeClass - Class to apply to the checked buttons
var CHECKBOX_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return ButtonCheckboxDirective; }),
    multi: true
};
/**
 * Add checkbox functionality to any element
 */
var ButtonCheckboxDirective = (function () {
    function ButtonCheckboxDirective() {
        /** Truthy value, will be set to ngModel */
        this.btnCheckboxTrue = true;
        /** Falsy value, will be set to ngModel */
        this.btnCheckboxFalse = false;
        this.state = false;
        this.onChange = Function.prototype;
        this.onTouched = Function.prototype;
    }
    // view -> model
    ButtonCheckboxDirective.prototype.onClick = function () {
        if (this.isDisabled) {
            return;
        }
        this.toggle(!this.state);
        this.onChange(this.value);
    };
    ButtonCheckboxDirective.prototype.ngOnInit = function () {
        this.toggle(this.trueValue === this.value);
    };
    Object.defineProperty(ButtonCheckboxDirective.prototype, "trueValue", {
        get: function () {
            return typeof this.btnCheckboxTrue !== 'undefined'
                ? this.btnCheckboxTrue
                : true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonCheckboxDirective.prototype, "falseValue", {
        get: function () {
            return typeof this.btnCheckboxFalse !== 'undefined'
                ? this.btnCheckboxFalse
                : false;
        },
        enumerable: true,
        configurable: true
    });
    ButtonCheckboxDirective.prototype.toggle = function (state) {
        this.state = state;
        this.value = this.state ? this.trueValue : this.falseValue;
    };
    // ControlValueAccessor
    // model -> view
    ButtonCheckboxDirective.prototype.writeValue = function (value) {
        this.state = this.trueValue === value;
        this.value = value ? this.trueValue : this.falseValue;
    };
    ButtonCheckboxDirective.prototype.setDisabledState = function (isDisabled) {
        this.isDisabled = isDisabled;
    };
    ButtonCheckboxDirective.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    ButtonCheckboxDirective.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    ButtonCheckboxDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[btnCheckbox]',
                    providers: [CHECKBOX_CONTROL_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    ButtonCheckboxDirective.ctorParameters = function () { return []; };
    ButtonCheckboxDirective.propDecorators = {
        'btnCheckboxTrue': [{ type: Input },],
        'btnCheckboxFalse': [{ type: Input },],
        'state': [{ type: HostBinding, args: ['class.active',] },],
        'onClick': [{ type: HostListener, args: ['click',] },],
    };
    return ButtonCheckboxDirective;
}());

// tslint:disable:no-use-before-declare
var RADIO_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return ButtonRadioDirective; }),
    multi: true
};
/**
 * Create radio buttons or groups of buttons.
 * A value of a selected button is bound to a variable specified via ngModel.
 */
var ButtonRadioDirective = (function () {
    function ButtonRadioDirective(el, cdr) {
        this.el = el;
        this.cdr = cdr;
        this.onChange = Function.prototype;
        this.onTouched = Function.prototype;
    }
    Object.defineProperty(ButtonRadioDirective.prototype, "isActive", {
        get: function () {
            return this.btnRadio === this.value;
        },
        enumerable: true,
        configurable: true
    });
    ButtonRadioDirective.prototype.onClick = function () {
        if (this.el.nativeElement.attributes.disabled) {
            return;
        }
        if (this.uncheckable && this.btnRadio === this.value) {
            this.value = undefined;
            this.onTouched();
            this.onChange(this.value);
            return;
        }
        if (this.btnRadio !== this.value) {
            this.value = this.btnRadio;
            this.onTouched();
            this.onChange(this.value);
        }
    };
    ButtonRadioDirective.prototype.ngOnInit = function () {
        this.uncheckable = typeof this.uncheckable !== 'undefined';
    };
    ButtonRadioDirective.prototype.onBlur = function () {
        this.onTouched();
    };
    // ControlValueAccessor
    // model -> view
    ButtonRadioDirective.prototype.writeValue = function (value) {
        this.value = value;
        this.cdr.markForCheck();
    };
    ButtonRadioDirective.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    ButtonRadioDirective.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    ButtonRadioDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[btnRadio]',
                    providers: [RADIO_CONTROL_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    ButtonRadioDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: ChangeDetectorRef, },
    ]; };
    ButtonRadioDirective.propDecorators = {
        'btnRadio': [{ type: Input },],
        'uncheckable': [{ type: Input },],
        'value': [{ type: Input },],
        'isActive': [{ type: HostBinding, args: ['class.active',] },],
        'onClick': [{ type: HostListener, args: ['click',] },],
    };
    return ButtonRadioDirective;
}());

var LinkedList = (function () {
    function LinkedList() {
        this.length = 0;
        this.asArray = [];
        // Array methods overriding END
    }
    LinkedList.prototype.get = function (position) {
        if (this.length === 0 || position < 0 || position >= this.length) {
            return void 0;
        }
        var current = this.head;
        for (var index = 0; index < position; index++) {
            current = current.next;
        }
        return current.value;
    };
    LinkedList.prototype.add = function (value, position) {
        if (position === void 0) { position = this.length; }
        if (position < 0 || position > this.length) {
            throw new Error('Position is out of the list');
        }
        var node = {
            value: value,
            next: undefined,
            previous: undefined
        };
        if (this.length === 0) {
            this.head = node;
            this.tail = node;
            this.current = node;
        }
        else {
            if (position === 0) {
                // first node
                node.next = this.head;
                this.head.previous = node;
                this.head = node;
            }
            else if (position === this.length) {
                // last node
                this.tail.next = node;
                node.previous = this.tail;
                this.tail = node;
            }
            else {
                // node in middle
                var currentPreviousNode = this.getNode(position - 1);
                var currentNextNode = currentPreviousNode.next;
                currentPreviousNode.next = node;
                currentNextNode.previous = node;
                node.previous = currentPreviousNode;
                node.next = currentNextNode;
            }
        }
        this.length++;
        this.createInternalArrayRepresentation();
    };
    LinkedList.prototype.remove = function (position) {
        if (position === void 0) { position = 0; }
        if (this.length === 0 || position < 0 || position >= this.length) {
            throw new Error('Position is out of the list');
        }
        if (position === 0) {
            // first node
            this.head = this.head.next;
            if (this.head) {
                // there is no second node
                this.head.previous = undefined;
            }
            else {
                // there is no second node
                this.tail = undefined;
            }
        }
        else if (position === this.length - 1) {
            // last node
            this.tail = this.tail.previous;
            this.tail.next = undefined;
        }
        else {
            // middle node
            var removedNode = this.getNode(position);
            removedNode.next.previous = removedNode.previous;
            removedNode.previous.next = removedNode.next;
        }
        this.length--;
        this.createInternalArrayRepresentation();
    };
    LinkedList.prototype.set = function (position, value) {
        if (this.length === 0 || position < 0 || position >= this.length) {
            throw new Error('Position is out of the list');
        }
        var node = this.getNode(position);
        node.value = value;
        this.createInternalArrayRepresentation();
    };
    LinkedList.prototype.toArray = function () {
        return this.asArray;
    };
    LinkedList.prototype.findAll = function (fn) {
        var current = this.head;
        var result = [];
        for (var index = 0; index < this.length; index++) {
            if (fn(current.value, index)) {
                result.push({ index: index, value: current.value });
            }
            current = current.next;
        }
        return result;
    };
    // Array methods overriding start
    LinkedList.prototype.push = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        args.forEach(function (arg) {
            _this.add(arg);
        });
        return this.length;
    };
    LinkedList.prototype.pop = function () {
        if (this.length === 0) {
            return undefined;
        }
        var last = this.tail;
        this.remove(this.length - 1);
        return last.value;
    };
    LinkedList.prototype.unshift = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        args.reverse();
        args.forEach(function (arg) {
            _this.add(arg, 0);
        });
        return this.length;
    };
    LinkedList.prototype.shift = function () {
        if (this.length === 0) {
            return undefined;
        }
        var lastItem = this.head.value;
        this.remove();
        return lastItem;
    };
    LinkedList.prototype.forEach = function (fn) {
        var current = this.head;
        for (var index = 0; index < this.length; index++) {
            fn(current.value, index);
            current = current.next;
        }
    };
    LinkedList.prototype.indexOf = function (value) {
        var current = this.head;
        var position = 0;
        for (var index = 0; index < this.length; index++) {
            if (current.value === value) {
                position = index;
                break;
            }
            current = current.next;
        }
        return position;
    };
    LinkedList.prototype.some = function (fn) {
        var current = this.head;
        var result = false;
        while (current && !result) {
            if (fn(current.value)) {
                result = true;
                break;
            }
            current = current.next;
        }
        return result;
    };
    LinkedList.prototype.every = function (fn) {
        var current = this.head;
        var result = true;
        while (current && result) {
            if (!fn(current.value)) {
                result = false;
            }
            current = current.next;
        }
        return result;
    };
    LinkedList.prototype.toString = function () {
        return '[Linked List]';
    };
    LinkedList.prototype.find = function (fn) {
        var current = this.head;
        var result;
        for (var index = 0; index < this.length; index++) {
            if (fn(current.value, index)) {
                result = current.value;
                break;
            }
            current = current.next;
        }
        return result;
    };
    LinkedList.prototype.findIndex = function (fn) {
        var current = this.head;
        var result;
        for (var index = 0; index < this.length; index++) {
            if (fn(current.value, index)) {
                result = index;
                break;
            }
            current = current.next;
        }
        return result;
    };
    LinkedList.prototype.getNode = function (position) {
        if (this.length === 0 || position < 0 || position >= this.length) {
            throw new Error('Position is out of the list');
        }
        var current = this.head;
        for (var index = 0; index < position; index++) {
            current = current.next;
        }
        return current;
    };
    LinkedList.prototype.createInternalArrayRepresentation = function () {
        var outArray = [];
        var current = this.head;
        while (current) {
            outArray.push(current.value);
            current = current.next;
        }
        this.asArray = outArray;
    };
    return LinkedList;
}());

/**
 * @copyright Valor Software
 * @copyright Angular ng-bootstrap team
 */
var Trigger = (function () {
    function Trigger(open, close) {
        this.open = open;
        this.close = close || open;
    }
    Trigger.prototype.isManual = function () {
        return this.open === 'manual' || this.close === 'manual';
    };
    return Trigger;
}());

var Utils = (function () {
    function Utils() {
    }
    Utils.reflow = function (element) {
        (function (bs) { return bs; })(element.offsetHeight);
    };
    // source: https://github.com/jquery/jquery/blob/master/src/css/var/getStyles.js
    Utils.getStyles = function (elem) {
        // Support: IE <=11 only, Firefox <=30 (#15098, #14150)
        // IE throws on elements created in popups
        // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
        var view = elem.ownerDocument.defaultView;
        if (!view || !view.opener) {
            view = win;
        }
        return view.getComputedStyle(elem);
    };
    return Utils;
}());

var CarouselConfig = (function () {
    function CarouselConfig() {
        /** Default interval of auto changing of slides */
        this.interval = 5000;
        /** Is loop of auto changing of slides can be paused */
        this.noPause = false;
        /** Is slides can wrap from the last to the first slide */
        this.noWrap = false;
    }
    CarouselConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CarouselConfig.ctorParameters = function () { return []; };
    return CarouselConfig;
}());

// tslint:disable:max-file-line-count
/***
 * pause (not yet supported) (?string='hover') - event group name which pauses
 * the cycling of the carousel, if hover pauses on mouseenter and resumes on
 * mouseleave keyboard (not yet supported) (?boolean=true) - if false
 * carousel will not react to keyboard events
 * note: swiping not yet supported
 */
/****
 * Problems:
 * 1) if we set an active slide via model changes, .active class remains on a
 * current slide.
 * 2) if we have only one slide, we shouldn't show prev/next nav buttons
 * 3) if first or last slide is active and noWrap is true, there should be
 * "disabled" class on the nav buttons.
 * 4) default interval should be equal 5000
 */
var Direction;
(function (Direction) {
    Direction[Direction["UNKNOWN"] = 0] = "UNKNOWN";
    Direction[Direction["NEXT"] = 1] = "NEXT";
    Direction[Direction["PREV"] = 2] = "PREV";
})(Direction || (Direction = {}));
/**
 * Base element to create carousel
 */
var CarouselComponent = (function () {
    function CarouselComponent(config, ngZone) {
        this.ngZone = ngZone;
        /** Will be emitted when active slide has been changed. Part of two-way-bindable [(activeSlide)] property */
        this.activeSlideChange = new EventEmitter(false);
        this._slides = new LinkedList();
        this.destroyed = false;
        Object.assign(this, config);
    }
    Object.defineProperty(CarouselComponent.prototype, "activeSlide", {
        get: function () {
            return this._currentActiveSlide;
        },
        /** Index of currently displayed slide(started for 0) */
        set: function (index) {
            if (this._slides.length && index !== this._currentActiveSlide) {
                this._select(index);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CarouselComponent.prototype, "interval", {
        /**
         * Delay of item cycling in milliseconds. If false, carousel won't cycle
         * automatically.
         */
        get: function () {
            return this._interval;
        },
        set: function (value) {
            this._interval = value;
            this.restartTimer();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CarouselComponent.prototype, "slides", {
        get: function () {
            return this._slides.toArray();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CarouselComponent.prototype, "isBs4", {
        get: function () {
            return !isBs3();
        },
        enumerable: true,
        configurable: true
    });
    CarouselComponent.prototype.ngOnDestroy = function () {
        this.destroyed = true;
    };
    /**
     * Adds new slide. If this slide is first in collection - set it as active
     * and starts auto changing
     * @param slide
     */
    CarouselComponent.prototype.addSlide = function (slide) {
        this._slides.add(slide);
        if (this._slides.length === 1) {
            this._currentActiveSlide = void 0;
            this.activeSlide = 0;
            this.play();
        }
    };
    /**
     * Removes specified slide. If this slide is active - will roll to another
     * slide
     * @param slide
     */
    CarouselComponent.prototype.removeSlide = function (slide) {
        var _this = this;
        var remIndex = this._slides.indexOf(slide);
        if (this._currentActiveSlide === remIndex) {
            // removing of active slide
            var nextSlideIndex_1 = void 0;
            if (this._slides.length > 1) {
                // if this slide last - will roll to first slide, if noWrap flag is
                // FALSE or to previous, if noWrap is TRUE in case, if this slide in
                // middle of collection, index of next slide is same to removed
                nextSlideIndex_1 = !this.isLast(remIndex)
                    ? remIndex
                    : this.noWrap ? remIndex - 1 : 0;
            }
            this._slides.remove(remIndex);
            // prevents exception with changing some value after checking
            setTimeout(function () {
                _this._select(nextSlideIndex_1);
            }, 0);
        }
        else {
            this._slides.remove(remIndex);
            var currentSlideIndex_1 = this.getCurrentSlideIndex();
            setTimeout(function () {
                // after removing, need to actualize index of current active slide
                _this._currentActiveSlide = currentSlideIndex_1;
                _this.activeSlideChange.emit(_this._currentActiveSlide);
            }, 0);
        }
    };
    /**
     * Rolling to next slide
     * @param force: {boolean} if true - will ignore noWrap flag
     */
    CarouselComponent.prototype.nextSlide = function (force) {
        if (force === void 0) { force = false; }
        this.activeSlide = this.findNextSlideIndex(Direction.NEXT, force);
    };
    /**
     * Rolling to previous slide
     * @param force: {boolean} if true - will ignore noWrap flag
     */
    CarouselComponent.prototype.previousSlide = function (force) {
        if (force === void 0) { force = false; }
        this.activeSlide = this.findNextSlideIndex(Direction.PREV, force);
    };
    /**
     * Rolling to specified slide
     * @param index: {number} index of slide, which must be shown
     */
    CarouselComponent.prototype.selectSlide = function (index) {
        this.activeSlide = index;
    };
    /**
     * Starts a auto changing of slides
     */
    CarouselComponent.prototype.play = function () {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.restartTimer();
        }
    };
    /**
     * Stops a auto changing of slides
     */
    CarouselComponent.prototype.pause = function () {
        if (!this.noPause) {
            this.isPlaying = false;
            this.resetTimer();
        }
    };
    /**
     * Finds and returns index of currently displayed slide
     * @returns {number}
     */
    CarouselComponent.prototype.getCurrentSlideIndex = function () {
        return this._slides.findIndex(function (slide) { return slide.active; });
    };
    /**
     * Defines, whether the specified index is last in collection
     * @param index
     * @returns {boolean}
     */
    CarouselComponent.prototype.isLast = function (index) {
        return index + 1 >= this._slides.length;
    };
    /**
     * Defines next slide index, depending of direction
     * @param direction: Direction(UNKNOWN|PREV|NEXT)
     * @param force: {boolean} if TRUE - will ignore noWrap flag, else will
     *   return undefined if next slide require wrapping
     * @returns {any}
     */
    CarouselComponent.prototype.findNextSlideIndex = function (direction, force) {
        var nextSlideIndex = 0;
        if (!force &&
            (this.isLast(this.activeSlide) &&
                direction !== Direction.PREV &&
                this.noWrap)) {
            return void 0;
        }
        switch (direction) {
            case Direction.NEXT:
                // if this is last slide, not force, looping is disabled
                // and need to going forward - select current slide, as a next
                nextSlideIndex = !this.isLast(this._currentActiveSlide)
                    ? this._currentActiveSlide + 1
                    : !force && this.noWrap ? this._currentActiveSlide : 0;
                break;
            case Direction.PREV:
                // if this is first slide, not force, looping is disabled
                // and need to going backward - select current slide, as a next
                nextSlideIndex =
                    this._currentActiveSlide > 0
                        ? this._currentActiveSlide - 1
                        : !force && this.noWrap
                            ? this._currentActiveSlide
                            : this._slides.length - 1;
                break;
            default:
                throw new Error('Unknown direction');
        }
        return nextSlideIndex;
    };
    /**
     * Sets a slide, which specified through index, as active
     * @param index
     * @private
     */
    CarouselComponent.prototype._select = function (index) {
        if (isNaN(index)) {
            this.pause();
            return;
        }
        var currentSlide = this._slides.get(this._currentActiveSlide);
        if (currentSlide) {
            currentSlide.active = false;
        }
        var nextSlide = this._slides.get(index);
        if (nextSlide) {
            this._currentActiveSlide = index;
            nextSlide.active = true;
            this.activeSlide = index;
            this.activeSlideChange.emit(index);
        }
    };
    /**
     * Starts loop of auto changing of slides
     */
    CarouselComponent.prototype.restartTimer = function () {
        var _this = this;
        this.resetTimer();
        var interval = +this.interval;
        if (!isNaN(interval) && interval > 0) {
            this.currentInterval = this.ngZone.runOutsideAngular(function () {
                return setInterval(function () {
                    var nInterval = +_this.interval;
                    _this.ngZone.run(function () {
                        if (_this.isPlaying &&
                            !isNaN(_this.interval) &&
                            nInterval > 0 &&
                            _this.slides.length) {
                            _this.nextSlide();
                        }
                        else {
                            _this.pause();
                        }
                    });
                }, interval);
            });
        }
    };
    /**
     * Stops loop of auto changing of slides
     */
    CarouselComponent.prototype.resetTimer = function () {
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = void 0;
        }
    };
    CarouselComponent.decorators = [
        { type: Component, args: [{
                    selector: 'carousel',
                    template: "<div (mouseenter)=\"pause()\" (mouseleave)=\"play()\" (mouseup)=\"play()\" class=\"carousel slide\"> <ol class=\"carousel-indicators\" *ngIf=\"slides.length > 1\"> <li *ngFor=\"let slidez of slides; let i = index;\" [class.active]=\"slidez.active === true\" (click)=\"selectSlide(i)\"></li> </ol> <div class=\"carousel-inner\"><ng-content></ng-content></div> <a class=\"left carousel-control carousel-control-prev\" [class.disabled]=\"activeSlide === 0 && noWrap\" (click)=\"previousSlide()\" *ngIf=\"slides.length > 1\"> <span class=\"icon-prev carousel-control-prev-icon\" aria-hidden=\"true\"></span> <span *ngIf=\"isBs4\" class=\"sr-only\">Previous</span> </a> <a class=\"right carousel-control carousel-control-next\" (click)=\"nextSlide()\"  [class.disabled]=\"isLast(activeSlide) && noWrap\" *ngIf=\"slides.length > 1\"> <span class=\"icon-next carousel-control-next-icon\" aria-hidden=\"true\"></span> <span class=\"sr-only\">Next</span> </a> </div> "
                },] },
    ];
    /** @nocollapse */
    CarouselComponent.ctorParameters = function () { return [
        { type: CarouselConfig, },
        { type: NgZone, },
    ]; };
    CarouselComponent.propDecorators = {
        'noWrap': [{ type: Input },],
        'noPause': [{ type: Input },],
        'activeSlideChange': [{ type: Output },],
        'activeSlide': [{ type: Input },],
        'interval': [{ type: Input },],
    };
    return CarouselComponent;
}());

getSetGlobalLocale('en', {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal: function (num) {
        var b = num % 10;
        var output = toInt((num % 100) / 10) === 1
            ? 'th'
            : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
        return num + output;
    }
});

getSetGlobalLocale('sv', {
    dayOfMonthOrdinalParse: /\d{1,2}(e|a)/,
    ordinal: function (num) {
        var b = num % 10;
        // tslint:disable-next-line:no-bitwise
        var output = (~~(num % 100 / 10) === 1) ? 'e' :
            (b === 1) ? 'a' :
                (b === 2) ? 'a' :
                    (b === 3) ? 'e' : 'e';
        return num + output;
    }
});

addFormatToken('D', ['DD', 2], 'Do', function (date) {
    return getDate(date).toString(10);
});

// FORMATTING
addFormatToken('d', null, 'do', function (date) {
    return getDayOfWeek(date).toString(10);
});
addFormatToken('dd', null, null, function (date, format, locale) {
    return locale.weekdaysShort(date);
});
addFormatToken('ddd', null, null, function (date, format, locale) {
    return locale.weekdaysMin(date);
});
addFormatToken('dddd', null, null, function (date, format, locale) {
    return locale.weekdays(date, format);
});
addFormatToken('e', null, null, function (date) {
    return getDayOfWeek(date).toString(10);
});
addFormatToken('E', null, null, function (date) {
    return getISODayOfWeek(date).toString(10);
});

function getISODayOfWeek(date) {
    return getDayOfWeek(date) || 7;
}

// import { makeGetSet } from '../moment/get-set';
// import { addFormatToken } from '../format/format';
// import { addUnitAlias } from './aliases';
// import { addUnitPriority } from './priorities';
// import { addRegexToken, match1to2, match2, match3to4, match5to6 } from '../parse/regex';
// import { addParseToken } from '../parse/token';
// import { HOUR, MINUTE, SECOND } from './constants';
// import toInt from '../utils/to-int';
// import zeroFill from '../utils/zero-fill';
// import getParsingFlags from '../create/parsing-flags';
// FORMATTING
function hFormat(date) {
    return getHours(date) % 12 || 12;
}
function kFormat(date) {
    return getHours(date) || 24;
}
addFormatToken('H', ['HH', 2], null, function (date, format, locale) {
    return getHours(date).toString(10);
});
addFormatToken('h', ['hh', 2], null, function (date, format, locale) {
    return hFormat(date).toString(10);
});
addFormatToken('k', ['kk', 2], null, function (date, format, locale) {
    return kFormat(date).toString(10);
});
addFormatToken('hmm', null, null, function (date, format, locale) {
    return "" + hFormat(date) + zeroFill(getMinutes(date), 2);
});
addFormatToken('hmmss', null, null, function (date, format, locale) {
    return "" + hFormat(date) + zeroFill(getMinutes(date), 2) + zeroFill(getSeconds(date), 2);
});
addFormatToken('Hmm', null, null, function (date, format, locale) {
    return "" + getHours(date) + zeroFill(getMinutes(date), 2);
});
addFormatToken('Hmmss', null, null, function (date, format, locale) {
    return "" + getHours(date) + zeroFill(getMinutes(date), 2) + zeroFill(getSeconds(date), 2);
});
function meridiem(token, lowercase) {
    addFormatToken(token, null, null, function (date, format, locale) {
        return locale.meridiem(getHours(date), getMinutes(date), lowercase);
    });
}
meridiem('a', true);
meridiem('A', false);

addFormatToken('m', ['mm', 2], null, function (date) {
    return getMinutes(date).toString(10);
});

// FORMATTING
addFormatToken('M', ['MM', 2], 'Mo', function (date, format) {
    return (getMonth(date) + 1).toString();
});
addFormatToken('MMM', null, null, function (date, format, locale) {
    return locale.monthsShort(date, format);
});
addFormatToken('MMMM', null, null, function (date, format, locale) {
    return locale.months(date, format);
});

addFormatToken('s', ['ss', 2], null, function (date) {
    return getSeconds(date).toString(10);
});

addFormatToken('w', ['ww', 2], 'wo', function (date, format, locale) {
    return getWeek(date, locale).toString(10);
});
addFormatToken('W', ['WW', 2], 'Wo', function (date) {
    return getISOWeek(date).toString(10);
});
function getWeek(date, locale) {
    return locale.week(date);
}
function getISOWeek(date) {
    return weekOfYear(date, 1, 4).week;
}

// moment.js
// version : 2.18.1
// authors : Tim Wood, Iskren Chernev, Moment.js contributors
// license : MIT
// momentjs.com
function formatDate(date, format, locale) {
    if (locale === void 0) { locale = 'en'; }
    var _locale = getLocale(locale);
    if (!_locale) {
        throw new Error("Locale \"" + locale + "\" is not defined, please add it with \"defineLocale(...)\"");
    }
    var output = formatMoment(date, format, _locale);
    return _locale.postformat(output);
}
// format date using native date object
function formatMoment(date, _format, locale) {
    if (!isDateValid(date)) {
        return locale.invalidDate;
    }
    var format = expandFormat(_format, locale);
    formatFunctions[format] =
        formatFunctions[format] || makeFormatFunction(format);
    return formatFunctions[format](date, locale);
}
function expandFormat(_format, locale) {
    var format = _format;
    var i = 5;
    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;
    var replaceLongDateFormatTokens = function (input) {
        return locale.formatLongDate(input) || input;
    };
    localFormattingTokens.lastIndex = 0;
    while (i >= 0 && localFormattingTokens.test(format)) {
        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        localFormattingTokens.lastIndex = 0;
        i -= 1;
    }
    return format;
}

var DateFormatter = (function () {
    function DateFormatter() {
    }
    DateFormatter.prototype.format = function (date, format, locale) {
        return formatDate(date, format, locale);
    };
    return DateFormatter;
}());

/* tslint:disable:max-file-line-count */
// const MIN_DATE:Date = void 0;
// const MAX_DATE:Date = void 0;
// const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/*
 const KEYS = {
 13: 'enter',
 32: 'space',
 33: 'pageup',
 34: 'pagedown',
 35: 'end',
 36: 'home',
 37: 'left',
 38: 'up',
 39: 'right',
 40: 'down'
 };
 */
var DatePickerInnerComponent = (function () {
    function DatePickerInnerComponent() {
        this.selectionDone = new EventEmitter(undefined);
        this.update = new EventEmitter(false);
        this.activeDateChange = new EventEmitter(undefined);
        this.stepDay = {};
        this.stepMonth = {};
        this.stepYear = {};
        this.modes = ['day', 'month', 'year'];
        this.dateFormatter = new DateFormatter();
    }
    Object.defineProperty(DatePickerInnerComponent.prototype, "activeDate", {
        get: function () {
            return this._activeDate;
        },
        set: function (value) {
            this._activeDate = value;
        },
        enumerable: true,
        configurable: true
    });
    // todo: add formatter value to Date object
    DatePickerInnerComponent.prototype.ngOnInit = function () {
        // todo: use date for unique value
        this.uniqueId = "datepicker--" + Math.floor(Math.random() * 10000);
        if (this.initDate) {
            this.activeDate = this.initDate;
            this.selectedDate = new Date(this.activeDate.valueOf());
            this.update.emit(this.activeDate);
        }
        else if (this.activeDate === undefined) {
            this.activeDate = new Date();
        }
    };
    // this.refreshView should be called here to reflect the changes on the fly
    // tslint:disable-next-line:no-unused-variable
    DatePickerInnerComponent.prototype.ngOnChanges = function (changes) {
        this.refreshView();
        this.checkIfActiveDateGotUpdated(changes.activeDate);
    };
    // Check if activeDate has been update and then emit the activeDateChange with the new date
    DatePickerInnerComponent.prototype.checkIfActiveDateGotUpdated = function (activeDate) {
        if (activeDate && !activeDate.firstChange) {
            var previousValue = activeDate.previousValue;
            if (previousValue &&
                previousValue instanceof Date &&
                previousValue.getTime() !== activeDate.currentValue.getTime()) {
                this.activeDateChange.emit(this.activeDate);
            }
        }
    };
    DatePickerInnerComponent.prototype.setCompareHandler = function (handler, type) {
        if (type === 'day') {
            this.compareHandlerDay = handler;
        }
        if (type === 'month') {
            this.compareHandlerMonth = handler;
        }
        if (type === 'year') {
            this.compareHandlerYear = handler;
        }
    };
    DatePickerInnerComponent.prototype.compare = function (date1, date2) {
        if (date1 === undefined || date2 === undefined) {
            return undefined;
        }
        if (this.datepickerMode === 'day' && this.compareHandlerDay) {
            return this.compareHandlerDay(date1, date2);
        }
        if (this.datepickerMode === 'month' && this.compareHandlerMonth) {
            return this.compareHandlerMonth(date1, date2);
        }
        if (this.datepickerMode === 'year' && this.compareHandlerYear) {
            return this.compareHandlerYear(date1, date2);
        }
        return void 0;
    };
    DatePickerInnerComponent.prototype.setRefreshViewHandler = function (handler, type) {
        if (type === 'day') {
            this.refreshViewHandlerDay = handler;
        }
        if (type === 'month') {
            this.refreshViewHandlerMonth = handler;
        }
        if (type === 'year') {
            this.refreshViewHandlerYear = handler;
        }
    };
    DatePickerInnerComponent.prototype.refreshView = function () {
        if (this.datepickerMode === 'day' && this.refreshViewHandlerDay) {
            this.refreshViewHandlerDay();
        }
        if (this.datepickerMode === 'month' && this.refreshViewHandlerMonth) {
            this.refreshViewHandlerMonth();
        }
        if (this.datepickerMode === 'year' && this.refreshViewHandlerYear) {
            this.refreshViewHandlerYear();
        }
    };
    DatePickerInnerComponent.prototype.dateFilter = function (date, format) {
        return this.dateFormatter.format(date, format, this.locale);
    };
    DatePickerInnerComponent.prototype.isActive = function (dateObject) {
        if (this.compare(dateObject.date, this.activeDate) === 0) {
            this.activeDateId = dateObject.uid;
            return true;
        }
        return false;
    };
    DatePickerInnerComponent.prototype.createDateObject = function (date, format) {
        var dateObject = {};
        dateObject.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        dateObject.label = this.dateFilter(date, format);
        dateObject.selected = this.compare(date, this.selectedDate) === 0;
        dateObject.disabled = this.isDisabled(date);
        dateObject.current = this.compare(date, new Date()) === 0;
        dateObject.customClass = this.getCustomClassForDate(dateObject.date);
        return dateObject;
    };
    DatePickerInnerComponent.prototype.split = function (arr, size) {
        var arrays = [];
        while (arr.length > 0) {
            arrays.push(arr.splice(0, size));
        }
        return arrays;
    };
    // Fix a hard-reproducible bug with timezones
    // The bug depends on OS, browser, current timezone and current date
    // i.e.
    // var date = new Date(2014, 0, 1);
    // console.log(date.getFullYear(), date.getMonth(), date.getDate(),
    // date.getHours()); can result in "2013 11 31 23" because of the bug.
    DatePickerInnerComponent.prototype.fixTimeZone = function (date) {
        var hours = date.getHours();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours === 23 ? hours + 2 : 0);
    };
    DatePickerInnerComponent.prototype.select = function (date, isManual) {
        if (isManual === void 0) { isManual = true; }
        if (this.datepickerMode === this.minMode) {
            if (!this.activeDate) {
                this.activeDate = new Date(0, 0, 0, 0, 0, 0, 0);
            }
            this.activeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            if (isManual) {
                this.selectionDone.emit(this.activeDate);
            }
        }
        else {
            this.activeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            if (isManual) {
                this.datepickerMode = this.modes[this.modes.indexOf(this.datepickerMode) - 1];
            }
        }
        this.selectedDate = new Date(this.activeDate.valueOf());
        this.update.emit(this.activeDate);
        this.refreshView();
    };
    DatePickerInnerComponent.prototype.move = function (direction) {
        var expectedStep;
        if (this.datepickerMode === 'day') {
            expectedStep = this.stepDay;
        }
        if (this.datepickerMode === 'month') {
            expectedStep = this.stepMonth;
        }
        if (this.datepickerMode === 'year') {
            expectedStep = this.stepYear;
        }
        if (expectedStep) {
            var year = this.activeDate.getFullYear() + direction * (expectedStep.years || 0);
            var month = this.activeDate.getMonth() + direction * (expectedStep.months || 0);
            this.activeDate = new Date(year, month, 1);
            this.refreshView();
            this.activeDateChange.emit(this.activeDate);
        }
    };
    DatePickerInnerComponent.prototype.toggleMode = function (_direction) {
        var direction = _direction || 1;
        if ((this.datepickerMode === this.maxMode && direction === 1) ||
            (this.datepickerMode === this.minMode && direction === -1)) {
            return;
        }
        this.datepickerMode = this.modes[this.modes.indexOf(this.datepickerMode) + direction];
        this.refreshView();
    };
    DatePickerInnerComponent.prototype.getCustomClassForDate = function (date) {
        var _this = this;
        if (!this.customClass) {
            return '';
        }
        // todo: build a hash of custom classes, it will work faster
        var customClassObject = this.customClass.find(function (customClass) {
            return (customClass.date.valueOf() === date.valueOf() &&
                customClass.mode === _this.datepickerMode);
        }, this);
        return customClassObject === undefined ? '' : customClassObject.clazz;
    };
    DatePickerInnerComponent.prototype.compareDateDisabled = function (date1Disabled, date2) {
        if (date1Disabled === undefined || date2 === undefined) {
            return undefined;
        }
        if (date1Disabled.mode === 'day' && this.compareHandlerDay) {
            return this.compareHandlerDay(date1Disabled.date, date2);
        }
        if (date1Disabled.mode === 'month' && this.compareHandlerMonth) {
            return this.compareHandlerMonth(date1Disabled.date, date2);
        }
        if (date1Disabled.mode === 'year' && this.compareHandlerYear) {
            return this.compareHandlerYear(date1Disabled.date, date2);
        }
        return undefined;
    };
    DatePickerInnerComponent.prototype.isDisabled = function (date) {
        var _this = this;
        var isDateDisabled = false;
        if (this.dateDisabled) {
            this.dateDisabled.forEach(function (disabledDate) {
                if (_this.compareDateDisabled(disabledDate, date) === 0) {
                    isDateDisabled = true;
                }
            });
        }
        return (isDateDisabled ||
            (this.minDate && this.compare(date, this.minDate) < 0) ||
            (this.maxDate && this.compare(date, this.maxDate) > 0));
    };
    DatePickerInnerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'datepicker-inner',
                    template: "\n    <!--&lt;!&ndash;ng-keydown=\"keydown($event)\"&ndash;&gt;-->\n    <div *ngIf=\"datepickerMode\" class=\"well well-sm bg-faded p-a card\" role=\"application\" >\n      <ng-content></ng-content>\n    </div>\n  "
                },] },
    ];
    /** @nocollapse */
    DatePickerInnerComponent.ctorParameters = function () { return []; };
    DatePickerInnerComponent.propDecorators = {
        'locale': [{ type: Input },],
        'datepickerMode': [{ type: Input },],
        'startingDay': [{ type: Input },],
        'yearRange': [{ type: Input },],
        'minDate': [{ type: Input },],
        'maxDate': [{ type: Input },],
        'minMode': [{ type: Input },],
        'maxMode': [{ type: Input },],
        'showWeeks': [{ type: Input },],
        'formatDay': [{ type: Input },],
        'formatMonth': [{ type: Input },],
        'formatYear': [{ type: Input },],
        'formatDayHeader': [{ type: Input },],
        'formatDayTitle': [{ type: Input },],
        'formatMonthTitle': [{ type: Input },],
        'onlyCurrentMonth': [{ type: Input },],
        'shortcutPropagation': [{ type: Input },],
        'customClass': [{ type: Input },],
        'monthColLimit': [{ type: Input },],
        'yearColLimit': [{ type: Input },],
        'dateDisabled': [{ type: Input },],
        'initDate': [{ type: Input },],
        'selectionDone': [{ type: Output },],
        'update': [{ type: Output },],
        'activeDateChange': [{ type: Output },],
        'activeDate': [{ type: Input },],
    };
    return DatePickerInnerComponent;
}());

var DatepickerConfig = (function () {
    function DatepickerConfig() {
        this.locale = 'en';
        this.datepickerMode = 'day';
        this.startingDay = 0;
        this.yearRange = 20;
        this.minMode = 'day';
        this.maxMode = 'year';
        this.showWeeks = true;
        this.formatDay = 'DD';
        this.formatMonth = 'MMMM';
        this.formatYear = 'YYYY';
        this.formatDayHeader = 'dd';
        this.formatDayTitle = 'MMMM YYYY';
        this.formatMonthTitle = 'YYYY';
        this.onlyCurrentMonth = false;
        this.monthColLimit = 3;
        this.yearColLimit = 5;
        this.shortcutPropagation = false;
    }
    DatepickerConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DatepickerConfig.ctorParameters = function () { return []; };
    return DatepickerConfig;
}());

var DATEPICKER_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line
    useExisting: forwardRef(function () { return DatePickerComponent; }),
    multi: true
};
/* tslint:disable:component-selector-name component-selector-type */
/* tslint:enable:component-selector-name component-selector-type */
var DatePickerComponent = (function () {
    function DatePickerComponent(config) {
        /** sets datepicker mode, supports: `day`, `month`, `year` */
        this.datepickerMode = 'day';
        /** if false week numbers will be hidden */
        this.showWeeks = true;
        this.selectionDone = new EventEmitter(undefined);
        /** callback to invoke when the activeDate is changed. */
        this.activeDateChange = new EventEmitter(undefined);
        this.onChange = Function.prototype;
        this.onTouched = Function.prototype;
        this._now = new Date();
        this.config = config;
        this.configureOptions();
    }
    Object.defineProperty(DatePickerComponent.prototype, "activeDate", {
        /** currently active date */
        get: function () {
            return this._activeDate || this._now;
        },
        set: function (value) {
            this._activeDate = value;
        },
        enumerable: true,
        configurable: true
    });
    DatePickerComponent.prototype.configureOptions = function () {
        Object.assign(this, this.config);
    };
    DatePickerComponent.prototype.onUpdate = function (event) {
        this.activeDate = event;
        this.onChange(event);
    };
    DatePickerComponent.prototype.onSelectionDone = function (event) {
        this.selectionDone.emit(event);
    };
    DatePickerComponent.prototype.onActiveDateChange = function (event) {
        this.activeDateChange.emit(event);
    };
    // todo: support null value
    DatePickerComponent.prototype.writeValue = function (value) {
        if (this._datePicker.compare(value, this._activeDate) === 0) {
            return;
        }
        if (value && value instanceof Date) {
            this.activeDate = value;
            this._datePicker.select(value, false);
            return;
        }
        this.activeDate = value ? new Date(value) : void 0;
    };
    DatePickerComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    DatePickerComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    DatePickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'datepicker',
                    template: "\n    <datepicker-inner [activeDate]=\"activeDate\"\n                      (update)=\"onUpdate($event)\"\n                      [locale]=\"config.locale\"\n                      [datepickerMode]=\"datepickerMode\"\n                      [initDate]=\"initDate\"\n                      [minDate]=\"minDate\"\n                      [maxDate]=\"maxDate\"\n                      [minMode]=\"minMode\"\n                      [maxMode]=\"maxMode\"\n                      [showWeeks]=\"showWeeks\"\n                      [formatDay]=\"formatDay\"\n                      [formatMonth]=\"formatMonth\"\n                      [formatYear]=\"formatYear\"\n                      [formatDayHeader]=\"formatDayHeader\"\n                      [formatDayTitle]=\"formatDayTitle\"\n                      [formatMonthTitle]=\"formatMonthTitle\"\n                      [startingDay]=\"startingDay\"\n                      [yearRange]=\"yearRange\"\n                      [customClass]=\"customClass\"\n                      [dateDisabled]=\"dateDisabled\"\n                      [onlyCurrentMonth]=\"onlyCurrentMonth\"\n                      [shortcutPropagation]=\"shortcutPropagation\"\n                      [monthColLimit]=\"monthColLimit\"\n                      [yearColLimit]=\"yearColLimit\"\n                      (selectionDone)=\"onSelectionDone($event)\"\n                      (activeDateChange)=\"onActiveDateChange($event)\">\n      <daypicker tabindex=\"0\"></daypicker>\n      <monthpicker tabindex=\"0\"></monthpicker>\n      <yearpicker tabindex=\"0\"></yearpicker>\n    </datepicker-inner>\n    ",
                    providers: [DATEPICKER_CONTROL_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    DatePickerComponent.ctorParameters = function () { return [
        { type: DatepickerConfig, },
    ]; };
    DatePickerComponent.propDecorators = {
        'datepickerMode': [{ type: Input },],
        'initDate': [{ type: Input },],
        'minDate': [{ type: Input },],
        'maxDate': [{ type: Input },],
        'minMode': [{ type: Input },],
        'maxMode': [{ type: Input },],
        'showWeeks': [{ type: Input },],
        'formatDay': [{ type: Input },],
        'formatMonth': [{ type: Input },],
        'formatYear': [{ type: Input },],
        'formatDayHeader': [{ type: Input },],
        'formatDayTitle': [{ type: Input },],
        'formatMonthTitle': [{ type: Input },],
        'startingDay': [{ type: Input },],
        'yearRange': [{ type: Input },],
        'onlyCurrentMonth': [{ type: Input },],
        'shortcutPropagation': [{ type: Input },],
        'monthColLimit': [{ type: Input },],
        'yearColLimit': [{ type: Input },],
        'customClass': [{ type: Input },],
        'dateDisabled': [{ type: Input },],
        'activeDate': [{ type: Input },],
        'selectionDone': [{ type: Output },],
        'activeDateChange': [{ type: Output },],
        '_datePicker': [{ type: ViewChild, args: [DatePickerInnerComponent,] },],
    };
    return DatePickerComponent;
}());

// @deprecated
// tslint:disable
var DayPickerComponent = (function () {
    function DayPickerComponent(datePicker) {
        this.labels = [];
        this.rows = [];
        this.weekNumbers = [];
        this.datePicker = datePicker;
    }
    Object.defineProperty(DayPickerComponent.prototype, "isBs4", {
        get: function () {
            return !isBs3();
        },
        enumerable: true,
        configurable: true
    });
    /*protected getDaysInMonth(year:number, month:number) {
     return ((month === 1) && (year % 4 === 0) &&
     ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month];
     }*/
    DayPickerComponent.prototype.ngOnInit = function () {
        var self = this;
        this.datePicker.stepDay = { months: 1 };
        this.datePicker.setRefreshViewHandler(function () {
            var year = this.activeDate.getFullYear();
            var month = this.activeDate.getMonth();
            var firstDayOfMonth = new Date(year, month, 1);
            var difference = this.startingDay - firstDayOfMonth.getDay();
            var numDisplayedFromPreviousMonth = difference > 0 ? 7 - difference : -difference;
            var firstDate = new Date(firstDayOfMonth.getTime());
            if (numDisplayedFromPreviousMonth > 0) {
                firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
            }
            // 42 is the number of days on a six-week calendar
            var _days = self.getDates(firstDate, 42);
            var days = [];
            for (var i = 0; i < 42; i++) {
                var _dateObject = this.createDateObject(_days[i], this.formatDay);
                _dateObject.secondary = _days[i].getMonth() !== month;
                _dateObject.uid = this.uniqueId + '-' + i;
                days[i] = _dateObject;
            }
            self.labels = [];
            for (var j = 0; j < 7; j++) {
                self.labels[j] = {};
                self.labels[j].abbr = this.dateFilter(days[j].date, this.formatDayHeader);
                self.labels[j].full = this.dateFilter(days[j].date, 'EEEE');
            }
            self.title = this.dateFilter(this.activeDate, this.formatDayTitle);
            self.rows = this.split(days, 7);
            if (this.showWeeks) {
                self.weekNumbers = [];
                var thursdayIndex = (4 + 7 - this.startingDay) % 7;
                var numWeeks = self.rows.length;
                for (var curWeek = 0; curWeek < numWeeks; curWeek++) {
                    self.weekNumbers.push(self.getISO8601WeekNumber(self.rows[curWeek][thursdayIndex].date));
                }
            }
        }, 'day');
        this.datePicker.setCompareHandler(function (date1, date2) {
            var d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
            var d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
            return d1.getTime() - d2.getTime();
        }, 'day');
        this.datePicker.refreshView();
    };
    DayPickerComponent.prototype.getDates = function (startDate, n) {
        var dates = new Array(n);
        var current = new Date(startDate.getTime());
        var i = 0;
        var date;
        while (i < n) {
            date = new Date(current.getTime());
            date = this.datePicker.fixTimeZone(date);
            dates[i++] = date;
            current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
        }
        return dates;
    };
    DayPickerComponent.prototype.getISO8601WeekNumber = function (date) {
        var checkDate = new Date(date.getTime());
        // Thursday
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
        var time = checkDate.getTime();
        // Compare with Jan 1
        checkDate.setMonth(0);
        checkDate.setDate(1);
        return (Math.floor(Math.round((time - checkDate.getTime()) / 86400000) / 7) + 1);
    };
    // todo: key events implementation
    DayPickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'daypicker',
                    template: "\n<table *ngIf=\"datePicker.datepickerMode==='day'\" role=\"grid\" [attr.aria-labelledby]=\"datePicker.uniqueId+'-title'\" aria-activedescendant=\"activeDateId\">\n  <thead>\n    <tr>\n      <th>\n        <button *ngIf=\"!isBs4\"\n                type=\"button\"\n                class=\"btn btn-default btn-secondary btn-sm pull-left float-left\"\n                (click)=\"datePicker.move(-1)\"\n                tabindex=\"-1\">\u2039</button>\n        <button *ngIf=\"isBs4\"\n                type=\"button\"\n                class=\"btn btn-default btn-secondary btn-sm pull-left float-left\"\n                (click)=\"datePicker.move(-1)\"\n                tabindex=\"-1\">&lt;</button>\n      </th>\n      <th [attr.colspan]=\"5 + (datePicker.showWeeks ? 1 : 0)\">\n        <button [id]=\"datePicker.uniqueId + '-title'\"\n                type=\"button\" class=\"btn btn-default btn-secondary btn-sm\"\n                (click)=\"datePicker.toggleMode()\"\n                [disabled]=\"datePicker.datepickerMode === datePicker.maxMode\"\n                [ngClass]=\"{disabled: datePicker.datepickerMode === datePicker.maxMode}\" tabindex=\"-1\" style=\"width:100%;\">\n          <strong>{{ title }}</strong>\n        </button>\n      </th>\n      <th>\n        <button *ngIf=\"!isBs4\"\n                type=\"button\"\n                class=\"btn btn-default btn-secondary btn-sm pull-right float-right\"\n                (click)=\"datePicker.move(1)\"\n                tabindex=\"-1\">\u203A</button>\n        <button *ngIf=\"isBs4\"\n                type=\"button\"\n                class=\"btn btn-default btn-secondary btn-sm pull-right float-right\"\n                (click)=\"datePicker.move(1)\"\n                tabindex=\"-1\">&gt;\n        </button>\n      </th>\n    </tr>\n    <tr>\n      <th *ngIf=\"datePicker.showWeeks\"></th>\n      <th *ngFor=\"let labelz of labels\" class=\"text-center\">\n        <small aria-label=\"labelz.full\"><b>{{ labelz.abbr }}</b></small>\n      </th>\n    </tr>\n  </thead>\n  <tbody>\n    <ng-template ngFor [ngForOf]=\"rows\" let-rowz=\"$implicit\" let-index=\"index\">\n      <tr *ngIf=\"!(datePicker.onlyCurrentMonth && rowz[0].secondary && rowz[6].secondary)\">\n        <td *ngIf=\"datePicker.showWeeks\" class=\"h6\" class=\"text-center\">\n          <em>{{ weekNumbers[index] }}</em>\n        </td>\n        <td *ngFor=\"let dtz of rowz\" class=\"text-center\" role=\"gridcell\" [id]=\"dtz.uid\">\n          <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-sm {{dtz.customClass}}\"\n                  *ngIf=\"!(datePicker.onlyCurrentMonth && dtz.secondary)\"\n                  [ngClass]=\"{'btn-secondary': isBs4 && !dtz.selected && !datePicker.isActive(dtz), 'btn-info': dtz.selected, disabled: dtz.disabled, active: !isBs4 && datePicker.isActive(dtz), 'btn-default': !isBs4}\"\n                  [disabled]=\"dtz.disabled\"\n                  (click)=\"datePicker.select(dtz.date)\" tabindex=\"-1\">\n            <span [ngClass]=\"{'text-muted': dtz.secondary || dtz.current, 'text-info': !isBs4 && dtz.current}\">{{ dtz.label }}</span>\n          </button>\n        </td>\n      </tr>\n    </ng-template>\n  </tbody>\n</table>\n  ",
                    styles: [
                        "\n    :host .btn-secondary {\n      color: #292b2c;\n      background-color: #fff;\n      border-color: #ccc;\n    }\n    :host .btn-info .text-muted {\n      color: #292b2c !important;\n    }\n  "
                    ]
                },] },
    ];
    /** @nocollapse */
    DayPickerComponent.ctorParameters = function () { return [
        { type: DatePickerInnerComponent, },
    ]; };
    return DayPickerComponent;
}());

// @deprecated
// tslint:disable
var MonthPickerComponent = (function () {
    function MonthPickerComponent(datePicker) {
        this.rows = [];
        this.datePicker = datePicker;
    }
    Object.defineProperty(MonthPickerComponent.prototype, "isBs4", {
        get: function () {
            return !isBs3();
        },
        enumerable: true,
        configurable: true
    });
    MonthPickerComponent.prototype.ngOnInit = function () {
        var self = this;
        this.datePicker.stepMonth = { years: 1 };
        this.datePicker.setRefreshViewHandler(function () {
            var months = new Array(12);
            var year = this.activeDate.getFullYear();
            var date;
            for (var i = 0; i < 12; i++) {
                date = new Date(year, i, 1);
                date = this.fixTimeZone(date);
                months[i] = this.createDateObject(date, this.formatMonth);
                months[i].uid = this.uniqueId + '-' + i;
            }
            self.title = this.dateFilter(this.activeDate, this.formatMonthTitle);
            self.rows = this.split(months, self.datePicker.monthColLimit);
        }, 'month');
        this.datePicker.setCompareHandler(function (date1, date2) {
            var d1 = new Date(date1.getFullYear(), date1.getMonth());
            var d2 = new Date(date2.getFullYear(), date2.getMonth());
            return d1.getTime() - d2.getTime();
        }, 'month');
        this.datePicker.refreshView();
    };
    // todo: key events implementation
    MonthPickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'monthpicker',
                    template: "\n<table *ngIf=\"datePicker.datepickerMode==='month'\" role=\"grid\">\n  <thead>\n    <tr>\n      <th>\n        <button type=\"button\" class=\"btn btn-default btn-sm pull-left float-left\"\n                (click)=\"datePicker.move(-1)\" tabindex=\"-1\">\u2039</button></th>\n      <th [attr.colspan]=\"((datePicker.monthColLimit - 2) <= 0) ? 1 : datePicker.monthColLimit - 2\">\n        <button [id]=\"datePicker.uniqueId + '-title'\"\n                type=\"button\" class=\"btn btn-default btn-sm\"\n                (click)=\"datePicker.toggleMode()\"\n                [disabled]=\"datePicker.datepickerMode === maxMode\"\n                [ngClass]=\"{disabled: datePicker.datepickerMode === maxMode}\" tabindex=\"-1\" style=\"width:100%;\">\n          <strong>{{ title }}</strong> \n        </button>\n      </th>\n      <th>\n        <button type=\"button\" class=\"btn btn-default btn-sm pull-right float-right\"\n                (click)=\"datePicker.move(1)\" tabindex=\"-1\">\u203A</button>\n      </th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr *ngFor=\"let rowz of rows\">\n      <td *ngFor=\"let dtz of rowz\" class=\"text-center\" role=\"gridcell\" id=\"{{dtz.uid}}\" [ngClass]=\"dtz.customClass\">\n        <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-default\"\n                [ngClass]=\"{'btn-link': isBs4 && !dtz.selected && !datePicker.isActive(dtz), 'btn-info': dtz.selected || (isBs4 && !dtz.selected && datePicker.isActive(dtz)), disabled: dtz.disabled, active: !isBs4 && datePicker.isActive(dtz)}\"\n                [disabled]=\"dtz.disabled\"\n                (click)=\"datePicker.select(dtz.date)\" tabindex=\"-1\">\n          <span [ngClass]=\"{'text-success': isBs4 && dtz.current, 'text-info': !isBs4 && dtz.current}\">{{ dtz.label }}</span>\n        </button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n  ",
                    styles: [
                        "\n    :host .btn-info .text-success {\n      color: #fff !important;\n    }\n  "
                    ]
                },] },
    ];
    /** @nocollapse */
    MonthPickerComponent.ctorParameters = function () { return [
        { type: DatePickerInnerComponent, },
    ]; };
    return MonthPickerComponent;
}());

// @deprecated
// tslint:disable
var YearPickerComponent = (function () {
    function YearPickerComponent(datePicker) {
        this.rows = [];
        this.datePicker = datePicker;
    }
    Object.defineProperty(YearPickerComponent.prototype, "isBs4", {
        get: function () {
            return !isBs3();
        },
        enumerable: true,
        configurable: true
    });
    YearPickerComponent.prototype.ngOnInit = function () {
        var self = this;
        this.datePicker.stepYear = { years: this.datePicker.yearRange };
        this.datePicker.setRefreshViewHandler(function () {
            var years = new Array(this.yearRange);
            var date;
            var start = self.getStartingYear(this.activeDate.getFullYear());
            for (var i = 0; i < this.yearRange; i++) {
                date = new Date(start + i, 0, 1);
                date = this.fixTimeZone(date);
                years[i] = this.createDateObject(date, this.formatYear);
                years[i].uid = this.uniqueId + '-' + i;
            }
            self.title = [years[0].label, years[this.yearRange - 1].label].join(' - ');
            self.rows = this.split(years, self.datePicker.yearColLimit);
        }, 'year');
        this.datePicker.setCompareHandler(function (date1, date2) {
            return date1.getFullYear() - date2.getFullYear();
        }, 'year');
        this.datePicker.refreshView();
    };
    YearPickerComponent.prototype.getStartingYear = function (year) {
        // todo: parseInt
        return ((year - 1) / this.datePicker.yearRange * this.datePicker.yearRange + 1);
    };
    YearPickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'yearpicker',
                    template: "\n<table *ngIf=\"datePicker.datepickerMode==='year'\" role=\"grid\">\n  <thead>\n    <tr>\n      <th>\n        <button type=\"button\" class=\"btn btn-default btn-sm pull-left float-left\"\n                (click)=\"datePicker.move(-1)\" tabindex=\"-1\">\u2039</button>\n      </th>\n      <th [attr.colspan]=\"((datePicker.yearColLimit - 2) <= 0) ? 1 : datePicker.yearColLimit - 2\">\n        <button [id]=\"datePicker.uniqueId + '-title'\" role=\"heading\"\n                type=\"button\" class=\"btn btn-default btn-sm\"\n                (click)=\"datePicker.toggleMode()\"\n                [disabled]=\"datePicker.datepickerMode === datePicker.maxMode\"\n                [ngClass]=\"{disabled: datePicker.datepickerMode === datePicker.maxMode}\" tabindex=\"-1\" style=\"width:100%;\">\n          <strong>{{ title }}</strong>\n        </button>\n      </th>\n      <th>\n        <button type=\"button\" class=\"btn btn-default btn-sm pull-right float-right\"\n                (click)=\"datePicker.move(1)\" tabindex=\"-1\">\u203A</button>\n      </th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr *ngFor=\"let rowz of rows\">\n      <td *ngFor=\"let dtz of rowz\" class=\"text-center\" role=\"gridcell\">\n        <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-default\"\n                [ngClass]=\"{'btn-link': isBs4 && !dtz.selected && !datePicker.isActive(dtz), 'btn-info': dtz.selected || (isBs4 && !dtz.selected && datePicker.isActive(dtz)), disabled: dtz.disabled, active: !isBs4 && datePicker.isActive(dtz)}\"\n                [disabled]=\"dtz.disabled\"\n                (click)=\"datePicker.select(dtz.date)\" tabindex=\"-1\">\n          <span [ngClass]=\"{'text-success': isBs4 && dtz.current, 'text-info': !isBs4 && dtz.current}\">{{ dtz.label }}</span>\n        </button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n  ",
                    styles: [
                        "\n    :host .btn-info .text-success {\n      color: #fff !important;\n    }\n  "
                    ]
                },] },
    ];
    /** @nocollapse */
    YearPickerComponent.ctorParameters = function () { return [
        { type: DatePickerInnerComponent, },
    ]; };
    return YearPickerComponent;
}());

var BsDatepickerActions = (function () {
    function BsDatepickerActions() {
    }
    BsDatepickerActions.prototype.calculate = function () {
        return { type: BsDatepickerActions.CALCULATE };
    };
    BsDatepickerActions.prototype.format = function () {
        return { type: BsDatepickerActions.FORMAT };
    };
    BsDatepickerActions.prototype.flag = function () {
        return { type: BsDatepickerActions.FLAG };
    };
    BsDatepickerActions.prototype.select = function (date) {
        return {
            type: BsDatepickerActions.SELECT,
            payload: date
        };
    };
    BsDatepickerActions.prototype.changeViewMode = function (event) {
        return {
            type: BsDatepickerActions.CHANGE_VIEWMODE,
            payload: event
        };
    };
    BsDatepickerActions.prototype.navigateTo = function (event) {
        return {
            type: BsDatepickerActions.NAVIGATE_TO,
            payload: event
        };
    };
    BsDatepickerActions.prototype.navigateStep = function (step) {
        return {
            type: BsDatepickerActions.NAVIGATE_OFFSET,
            payload: step
        };
    };
    BsDatepickerActions.prototype.setOptions = function (options) {
        return {
            type: BsDatepickerActions.SET_OPTIONS,
            payload: options
        };
    };
    // date range picker
    BsDatepickerActions.prototype.selectRange = function (value) {
        return {
            type: BsDatepickerActions.SELECT_RANGE,
            payload: value
        };
    };
    BsDatepickerActions.prototype.hoverDay = function (event) {
        return {
            type: BsDatepickerActions.HOVER,
            payload: event.isHovered ? event.cell.date : null
        };
    };
    BsDatepickerActions.prototype.minDate = function (date) {
        return {
            type: BsDatepickerActions.SET_MIN_DATE,
            payload: date
        };
    };
    BsDatepickerActions.prototype.maxDate = function (date) {
        return {
            type: BsDatepickerActions.SET_MAX_DATE,
            payload: date
        };
    };
    BsDatepickerActions.prototype.isDisabled = function (value) {
        return {
            type: BsDatepickerActions.SET_IS_DISABLED,
            payload: value
        };
    };
    BsDatepickerActions.CALCULATE = '[datepicker] calculate dates matrix';
    BsDatepickerActions.FORMAT = '[datepicker] format datepicker values';
    BsDatepickerActions.FLAG = '[datepicker] set flags';
    BsDatepickerActions.SELECT = '[datepicker] select date';
    BsDatepickerActions.NAVIGATE_OFFSET = '[datepicker] shift view date';
    BsDatepickerActions.NAVIGATE_TO = '[datepicker] change view date';
    BsDatepickerActions.SET_OPTIONS = '[datepicker] update render options';
    BsDatepickerActions.HOVER = '[datepicker] hover date';
    BsDatepickerActions.CHANGE_VIEWMODE = '[datepicker] switch view mode';
    BsDatepickerActions.SET_MIN_DATE = '[datepicker] set min date';
    BsDatepickerActions.SET_MAX_DATE = '[datepicker] set max date';
    BsDatepickerActions.SET_IS_DISABLED = '[datepicker] set is disabled';
    BsDatepickerActions.SELECT_RANGE = '[daterangepicker] select dates range';
    BsDatepickerActions.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BsDatepickerActions.ctorParameters = function () { return []; };
    return BsDatepickerActions;
}());

var __extends$1 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @copyright ngrx
 */
var MiniStore = (function (_super) {
    __extends$1(MiniStore, _super);
    function MiniStore(_dispatcher, _reducer, state$) {
        var _this = _super.call(this) || this;
        _this._dispatcher = _dispatcher;
        _this._reducer = _reducer;
        _this.source = state$;
        return _this;
    }
    MiniStore.prototype.select = function (pathOrMapFn) {
        var mapped$ = map$1.call(this, pathOrMapFn);
        return distinctUntilChanged$1.call(mapped$);
    };
    MiniStore.prototype.lift = function (operator) {
        var store = new MiniStore(this._dispatcher, this._reducer, this);
        store.operator = operator;
        return store;
    };
    MiniStore.prototype.dispatch = function (action) {
        this._dispatcher.next(action);
    };
    MiniStore.prototype.next = function (action) {
        this._dispatcher.next(action);
    };
    MiniStore.prototype.error = function (err) {
        this._dispatcher.error(err);
    };
    MiniStore.prototype.complete = function () {
        /*noop*/
    };
    return MiniStore;
}(Observable$1));

var defaultMonthOptions = {
    width: 7,
    height: 6
};

var BsDatepickerConfig = (function () {
    function BsDatepickerConfig() {
        /** CSS class which will be applied to datepicker container,
         * usually used to set color theme
         */
        this.containerClass = 'theme-green';
        // DatepickerRenderOptions
        this.displayMonths = 1;
        /**
         * Allows to hide week numbers in datepicker
         */
        this.showWeekNumbers = true;
        this.dateInputFormat = 'L';
        // range picker
        this.rangeSeparator = ' - ';
        this.rangeInputFormat = 'L';
        // DatepickerFormatOptions
        /**
         * Allows to globally set default locale of datepicker,
         * see documentation on how to enable custom locales
         */
        this.locale = 'en';
        this.monthTitle = 'MMMM';
        this.yearTitle = 'YYYY';
        this.dayLabel = 'D';
        this.monthLabel = 'MMMM';
        this.yearLabel = 'YYYY';
        this.weekNumbers = 'w';
    }
    BsDatepickerConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BsDatepickerConfig.ctorParameters = function () { return []; };
    return BsDatepickerConfig;
}());

var _initialView = { date: new Date(), mode: 'day' };
var initialDatepickerState = Object.assign(new BsDatepickerConfig(), {
    view: _initialView,
    selectedRange: [],
    monthViewOptions: defaultMonthOptions
});

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

// CommonJS / Node have global context exposed as "global" variable.
// We don't want to include the whole node.d.ts this this compilation unit so we'll just fake
// the global "global" var for now.
var __window = typeof window !== 'undefined' && window;
var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope && self;
var __global = typeof commonjsGlobal !== 'undefined' && commonjsGlobal;
var _root = __window || __global || __self;
var root_1 = _root;
// Workaround Closure Compiler restriction: The body of a goog.module cannot use throw.
// This is needed when used with angular/tsickle which inserts a goog.module statement.
// Wrap in IIFE
(function () {
    if (!_root) {
        throw new Error('RxJS could not find any global context (window, self, global)');
    }
})();


var root = {
	root: root_1
};

var isArray_1 = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });


var isArray$1 = {
	isArray: isArray_1
};

function isObject$1(x) {
    return x != null && typeof x === 'object';
}
var isObject_2 = isObject$1;


var isObject_1 = {
	isObject: isObject_2
};

function isFunction$1(x) {
    return typeof x === 'function';
}
var isFunction_2 = isFunction$1;


var isFunction_1 = {
	isFunction: isFunction_2
};

// typeof any so that it we don't have to cast when comparing a result to the error object
var errorObject_1 = { e: {} };


var errorObject = {
	errorObject: errorObject_1
};

var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        errorObject.errorObject.e = e;
        return errorObject.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
var tryCatch_2 = tryCatch;



var tryCatch_1 = {
	tryCatch: tryCatch_2
};

var __extends$6 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
var UnsubscriptionError = (function (_super) {
    __extends$6(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        _super.call(this);
        this.errors = errors;
        var err = Error.call(this, errors ?
            errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return ((i + 1) + ") " + err.toString()); }).join('\n  ') : '');
        this.name = err.name = 'UnsubscriptionError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return UnsubscriptionError;
}(Error));
var UnsubscriptionError_2 = UnsubscriptionError;


var UnsubscriptionError_1 = {
	UnsubscriptionError: UnsubscriptionError_2
};

/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
var Subscription = (function () {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    function Subscription(unsubscribe) {
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        // null out _subscriptions first so any child subscriptions that attempt
        // to remove themselves from this subscription will noop
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        // if this._parent is null, then so is this._parents, and we
        // don't have to remove ourselves from any parent subscriptions.
        while (_parent) {
            _parent.remove(this);
            // if this._parents is null or index >= len,
            // then _parent is set to null, and the loop exits
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject.errorObject) {
                hasErrors = true;
                errors = errors || (errorObject.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ?
                    flattenUnsubscriptionErrors(errorObject.errorObject.e.errors) : [errorObject.errorObject.e]);
            }
        }
        if (isArray$1.isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject.errorObject.e;
                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
    /**
     * Adds a tear down to be called during the unsubscribe() of this
     * Subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    Subscription.prototype.add = function (teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (typeof subscription._addParent !== 'function' /* quack quack */) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.prototype._addParent = function (parent) {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        if (!_parent || _parent === parent) {
            // If we don't have a parent, or the new parent is the same as the
            // current parent, then set this._parent to the new parent.
            this._parent = parent;
        }
        else if (!_parents) {
            // If there's already one parent, but not multiple, allocate an Array to
            // store the rest of the parent Subscriptions.
            this._parents = [parent];
        }
        else if (_parents.indexOf(parent) === -1) {
            // Only add the new parent to the _parents list if it's not already there.
            _parents.push(parent);
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
var Subscription_2 = Subscription;
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
}


var Subscription_1 = {
	Subscription: Subscription_2
};

var __extends$5 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * A unit of work to be executed in a {@link Scheduler}. An action is typically
 * created from within a Scheduler and an RxJS user does not need to concern
 * themselves about creating and manipulating an Action.
 *
 * ```ts
 * class Action<T> extends Subscription {
 *   new (scheduler: Scheduler, work: (state?: T) => void);
 *   schedule(state?: T, delay: number = 0): Subscription;
 * }
 * ```
 *
 * @class Action<T>
 */
var Action = (function (_super) {
    __extends$5(Action, _super);
    function Action(scheduler, work) {
        _super.call(this);
    }
    /**
     * Schedules this action on its parent Scheduler for execution. May be passed
     * some context object, `state`. May happen at some point in the future,
     * according to the `delay` parameter, if specified.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler.
     * @return {void}
     */
    Action.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        return this;
    };
    return Action;
}(Subscription_1.Subscription));
var Action_2 = Action;


var Action_1 = {
	Action: Action_2
};

var __extends$4 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AsyncAction = (function (_super) {
    __extends$4(AsyncAction, _super);
    function AsyncAction(scheduler, work) {
        _super.call(this, scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
        this.pending = false;
    }
    AsyncAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        if (this.closed) {
            return this;
        }
        // Always replace the current state with the new state.
        this.state = state;
        // Set the pending flag indicating that this action has been scheduled, or
        // has recursively rescheduled itself.
        this.pending = true;
        var id = this.id;
        var scheduler = this.scheduler;
        //
        // Important implementation note:
        //
        // Actions only execute once by default, unless rescheduled from within the
        // scheduled callback. This allows us to implement single and repeat
        // actions via the same code path, without adding API surface area, as well
        // as mimic traditional recursion but across asynchronous boundaries.
        //
        // However, JS runtimes and timers distinguish between intervals achieved by
        // serial `setTimeout` calls vs. a single `setInterval` call. An interval of
        // serial `setTimeout` calls can be individually delayed, which delays
        // scheduling the next `setTimeout`, and so on. `setInterval` attempts to
        // guarantee the interval callback will be invoked more precisely to the
        // interval period, regardless of load.
        //
        // Therefore, we use `setInterval` to schedule single and repeat actions.
        // If the action reschedules itself with the same delay, the interval is not
        // canceled. If the action doesn't reschedule, or reschedules with a
        // different delay, the interval will be canceled after scheduled callback
        // execution.
        //
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
        }
        this.delay = delay;
        // If this action has already an async Id, don't request a new one.
        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
        return this;
    };
    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        return root.root.setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        // If this action is rescheduled with the same delay time, don't clear the interval id.
        if (delay !== null && this.delay === delay && this.pending === false) {
            return id;
        }
        // Otherwise, if the action's delay time is different from the current delay,
        // or the action has been rescheduled before it's executed, clear the interval id
        return root.root.clearInterval(id) && undefined || undefined;
    };
    /**
     * Immediately executes this action and the `work` it contains.
     * @return {any}
     */
    AsyncAction.prototype.execute = function (state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        var error = this._execute(state, delay);
        if (error) {
            return error;
        }
        else if (this.pending === false && this.id != null) {
            // Dequeue if the action didn't reschedule itself. Don't call
            // unsubscribe(), because the action could reschedule later.
            // For example:
            // ```
            // scheduler.schedule(function doWork(counter) {
            //   /* ... I'm a busy worker bee ... */
            //   var originalAction = this;
            //   /* wait 100ms before rescheduling the action */
            //   setTimeout(function () {
            //     originalAction.schedule(counter + 1);
            //   }, 100);
            // }, 1000);
            // ```
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
    };
    AsyncAction.prototype._execute = function (state, delay) {
        var errored = false;
        var errorValue = undefined;
        try {
            this.work(state);
        }
        catch (e) {
            errored = true;
            errorValue = !!e && e || new Error(e);
        }
        if (errored) {
            this.unsubscribe();
            return errorValue;
        }
    };
    AsyncAction.prototype._unsubscribe = function () {
        var id = this.id;
        var scheduler = this.scheduler;
        var actions = scheduler.actions;
        var index = actions.indexOf(this);
        this.work = null;
        this.state = null;
        this.pending = false;
        this.scheduler = null;
        if (index !== -1) {
            actions.splice(index, 1);
        }
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, null);
        }
        this.delay = null;
    };
    return AsyncAction;
}(Action_1.Action));
var AsyncAction_2 = AsyncAction;


var AsyncAction_1 = {
	AsyncAction: AsyncAction_2
};

var __extends$3 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var QueueAction = (function (_super) {
    __extends$3(QueueAction, _super);
    function QueueAction(scheduler, work) {
        _super.call(this, scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    QueueAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        if (delay > 0) {
            return _super.prototype.schedule.call(this, state, delay);
        }
        this.delay = delay;
        this.state = state;
        this.scheduler.flush(this);
        return this;
    };
    QueueAction.prototype.execute = function (state, delay) {
        return (delay > 0 || this.closed) ?
            _super.prototype.execute.call(this, state, delay) :
            this._execute(state, delay);
    };
    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        // If delay exists and is greater than 0, or if the delay is null (the
        // action wasn't rescheduled) but was originally scheduled as an async
        // action, then recycle as an async action.
        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        // Otherwise flush the scheduler starting with this action.
        return scheduler.flush(this);
    };
    return QueueAction;
}(AsyncAction_1.AsyncAction));
var QueueAction_2 = QueueAction;


var QueueAction_1 = {
	QueueAction: QueueAction_2
};

/**
 * An execution context and a data structure to order tasks and schedule their
 * execution. Provides a notion of (potentially virtual) time, through the
 * `now()` getter method.
 *
 * Each unit of work in a Scheduler is called an {@link Action}.
 *
 * ```ts
 * class Scheduler {
 *   now(): number;
 *   schedule(work, delay?, state?): Subscription;
 * }
 * ```
 *
 * @class Scheduler
 */
var Scheduler = (function () {
    function Scheduler(SchedulerAction, now) {
        if (now === void 0) { now = Scheduler.now; }
        this.SchedulerAction = SchedulerAction;
        this.now = now;
    }
    /**
     * Schedules a function, `work`, for execution. May happen at some point in
     * the future, according to the `delay` parameter, if specified. May be passed
     * some context object, `state`, which will be passed to the `work` function.
     *
     * The given arguments will be processed an stored as an Action object in a
     * queue of actions.
     *
     * @param {function(state: ?T): ?Subscription} work A function representing a
     * task, or some unit of work to be executed by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler itself.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @return {Subscription} A subscription in order to be able to unsubscribe
     * the scheduled work.
     */
    Scheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) { delay = 0; }
        return new this.SchedulerAction(this, work).schedule(state, delay);
    };
    Scheduler.now = Date.now ? Date.now : function () { return +new Date(); };
    return Scheduler;
}());
var Scheduler_2 = Scheduler;


var Scheduler_1 = {
	Scheduler: Scheduler_2
};

var __extends$8 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var AsyncScheduler = (function (_super) {
    __extends$8(AsyncScheduler, _super);
    function AsyncScheduler() {
        _super.apply(this, arguments);
        this.actions = [];
        /**
         * A flag to indicate whether the Scheduler is currently executing a batch of
         * queued actions.
         * @type {boolean}
         */
        this.active = false;
        /**
         * An internal ID used to track the latest asynchronous task such as those
         * coming from `setTimeout`, `setInterval`, `requestAnimationFrame`, and
         * others.
         * @type {any}
         */
        this.scheduled = undefined;
    }
    AsyncScheduler.prototype.flush = function (action) {
        var actions = this.actions;
        if (this.active) {
            actions.push(action);
            return;
        }
        var error;
        this.active = true;
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (action = actions.shift()); // exhaust the scheduler queue
        this.active = false;
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AsyncScheduler;
}(Scheduler_1.Scheduler));
var AsyncScheduler_2 = AsyncScheduler;


var AsyncScheduler_1 = {
	AsyncScheduler: AsyncScheduler_2
};

var __extends$7 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var QueueScheduler = (function (_super) {
    __extends$7(QueueScheduler, _super);
    function QueueScheduler() {
        _super.apply(this, arguments);
    }
    return QueueScheduler;
}(AsyncScheduler_1.AsyncScheduler));
var QueueScheduler_2 = QueueScheduler;


var QueueScheduler_1 = {
	QueueScheduler: QueueScheduler_2
};

/**
 *
 * Queue Scheduler
 *
 * <span class="informal">Put every next task on a queue, instead of executing it immediately</span>
 *
 * `queue` scheduler, when used with delay, behaves the same as {@link async} scheduler.
 *
 * When used without delay, it schedules given task synchronously - executes it right when
 * it is scheduled. However when called recursively, that is when inside the scheduled task,
 * another task is scheduled with queue scheduler, instead of executing immediately as well,
 * that task will be put on a queue and wait for current one to finish.
 *
 * This means that when you execute task with `queue` scheduler, you are sure it will end
 * before any other task scheduled with that scheduler will start.
 *
 * @examples <caption>Schedule recursively first, then do something</caption>
 *
 * Rx.Scheduler.queue.schedule(() => {
 *   Rx.Scheduler.queue.schedule(() => console.log('second')); // will not happen now, but will be put on a queue
 *
 *   console.log('first');
 * });
 *
 * // Logs:
 * // "first"
 * // "second"
 *
 *
 * @example <caption>Reschedule itself recursively</caption>
 *
 * Rx.Scheduler.queue.schedule(function(state) {
 *   if (state !== 0) {
 *     console.log('before', state);
 *     this.schedule(state - 1); // `this` references currently executing Action,
 *                               // which we reschedule with new state
 *     console.log('after', state);
 *   }
 * }, 0, 3);
 *
 * // In scheduler that runs recursively, you would expect:
 * // "before", 3
 * // "before", 2
 * // "before", 1
 * // "after", 1
 * // "after", 2
 * // "after", 3
 *
 * // But with queue it logs:
 * // "before", 3
 * // "after", 3
 * // "before", 2
 * // "after", 2
 * // "before", 1
 * // "after", 1
 *
 *
 * @static true
 * @name queue
 * @owner Scheduler
 */
var queue_1 = new QueueScheduler_1.QueueScheduler(QueueAction_1.QueueAction);

var __extends$2 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @copyright ngrx
 */
var MiniState = (function (_super) {
    __extends$2(MiniState, _super);
    function MiniState(_initialState, actionsDispatcher$, reducer) {
        var _this = _super.call(this, _initialState) || this;
        var actionInQueue$ = observeOn$1.call(actionsDispatcher$, queue_1);
        var state$ = scan$1.call(actionInQueue$, function (state, action) {
            if (!action) {
                return state;
            }
            return reducer(state, action);
        }, _initialState);
        state$.subscribe(function (value) { return _this.next(value); });
        return _this;
    }
    return MiniState;
}(BehaviorSubject$1));

function isAfter(date1, date2, units) {
    if (units === void 0) { units = 'milliseconds'; }
    if (!date1 || !date2) {
        return false;
    }
    if (units === 'milliseconds') {
        return date1.valueOf() > date2.valueOf();
    }
    return date2.valueOf() < startOf(date1, units).valueOf();
}
function isBefore(date1, date2, units) {
    if (units === void 0) { units = 'milliseconds'; }
    if (!date1 || !date2) {
        return false;
    }
    if (units === 'milliseconds') {
        return date1.valueOf() < date2.valueOf();
    }
    return endOf(date1, units).valueOf() < date2.valueOf();
}

function isSame(date1, date2, units) {
    if (units === void 0) { units = 'milliseconds'; }
    if (!date1 || !date2) {
        return false;
    }
    if (units === 'milliseconds') {
        return date1.valueOf() === date2.valueOf();
    }
    var inputMs = date2.valueOf();
    return (startOf(date1, units).valueOf() <= inputMs &&
        inputMs <= endOf(date1, units).valueOf());
}
function isSameOrAfter(date1, date2, units) {
    return isSame(date1, date2, units) || isAfter(date1, date2, units);
}
function isSameOrBefore(date1, date2, units) {
    return isSame(date1, date2, units) || isBefore(date1, date2, units);
}

function getStartingDayOfCalendar(date, options) {
    if (isFirstDayOfWeek(date, options.firstDayOfWeek)) {
        return date;
    }
    var weekDay = getDayOfWeek(date);
    var offset = calculateDateOffset(weekDay, options.firstDayOfWeek);
    return shiftDate(date, { day: -offset });
}
function calculateDateOffset(weekday, startingDayOffset) {
    if (startingDayOffset === 0) {
        return weekday;
    }
    var offset = weekday - startingDayOffset % 7;
    return offset < 0 ? offset + 7 : offset;
}
function isMonthDisabled(date, min, max) {
    var minBound = min && isSameOrBefore(endOf(date, 'month'), min, 'day');
    var maxBound = max && isSameOrAfter(startOf(date, 'month'), max, 'day');
    return minBound || maxBound;
}
function isYearDisabled(date, min, max) {
    var minBound = min && isSameOrBefore(endOf(date, 'year'), min, 'day');
    var maxBound = max && isSameOrAfter(startOf(date, 'year'), max, 'day');
    return minBound || maxBound;
}

function createMatrix(options, fn) {
    var prevValue = options.initialDate;
    var matrix = new Array(options.height);
    for (var i = 0; i < options.height; i++) {
        matrix[i] = new Array(options.width);
        for (var j = 0; j < options.width; j++) {
            matrix[i][j] = fn(prevValue);
            prevValue = shiftDate(prevValue, options.shift);
        }
    }
    return matrix;
}

function calcDaysCalendar(startingDate, options) {
    var firstDay = getFirstDayOfMonth(startingDate);
    var initialDate = getStartingDayOfCalendar(firstDay, options);
    var matrixOptions = {
        width: options.width,
        height: options.height,
        initialDate: initialDate,
        shift: { day: 1 }
    };
    var daysMatrix = createMatrix(matrixOptions, function (date) { return date; });
    return {
        daysMatrix: daysMatrix,
        month: firstDay
    };
}

function formatDaysCalendar(daysCalendar, formatOptions, monthIndex) {
    return {
        month: daysCalendar.month,
        monthTitle: formatDate(daysCalendar.month, formatOptions.monthTitle, formatOptions.locale),
        yearTitle: formatDate(daysCalendar.month, formatOptions.yearTitle, formatOptions.locale),
        weekNumbers: getWeekNumbers(daysCalendar.daysMatrix, formatOptions.weekNumbers, formatOptions.locale),
        weekdays: getShiftedWeekdays(formatOptions.locale),
        weeks: daysCalendar.daysMatrix.map(function (week, weekIndex) { return ({
            days: week.map(function (date, dayIndex) { return ({
                date: date,
                label: formatDate(date, formatOptions.dayLabel, formatOptions.locale),
                monthIndex: monthIndex,
                weekIndex: weekIndex,
                dayIndex: dayIndex
            }); })
        }); })
    };
}
function getWeekNumbers(daysMatrix, format, locale) {
    return daysMatrix.map(function (days) { return (days[0] ? formatDate(days[0], format, locale) : ''); });
}
function getShiftedWeekdays(locale) {
    var _locale = getLocale(locale);
    var weekdays = _locale.weekdaysShort();
    var firstDayOfWeek = _locale.firstDayOfWeek();
    return weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
}

function flagDaysCalendar(formattedMonth, options) {
    formattedMonth.weeks.forEach(function (week, weekIndex) {
        week.days.forEach(function (day, dayIndex) {
            // datepicker
            var isOtherMonth = !isSameMonth(day.date, formattedMonth.month);
            var isHovered = !isOtherMonth && isSameDay(day.date, options.hoveredDate);
            // date range picker
            var isSelectionStart = !isOtherMonth &&
                options.selectedRange &&
                isSameDay(day.date, options.selectedRange[0]);
            var isSelectionEnd = !isOtherMonth &&
                options.selectedRange &&
                isSameDay(day.date, options.selectedRange[1]);
            var isSelected = (!isOtherMonth && isSameDay(day.date, options.selectedDate)) ||
                isSelectionStart ||
                isSelectionEnd;
            var isInRange = !isOtherMonth &&
                options.selectedRange &&
                isDateInRange(day.date, options.selectedRange, options.hoveredDate);
            var isDisabled = options.isDisabled ||
                isBefore(day.date, options.minDate, 'day') ||
                isAfter(day.date, options.maxDate, 'day');
            // decide update or not
            var newDay = Object.assign({}, day, {
                isOtherMonth: isOtherMonth,
                isHovered: isHovered,
                isSelected: isSelected,
                isSelectionStart: isSelectionStart,
                isSelectionEnd: isSelectionEnd,
                isInRange: isInRange,
                isDisabled: isDisabled
            });
            if (day.isOtherMonth !== newDay.isOtherMonth ||
                day.isHovered !== newDay.isHovered ||
                day.isSelected !== newDay.isSelected ||
                day.isSelectionStart !== newDay.isSelectionStart ||
                day.isSelectionEnd !== newDay.isSelectionEnd ||
                day.isDisabled !== newDay.isDisabled ||
                day.isInRange !== newDay.isInRange) {
                week.days[dayIndex] = newDay;
            }
        });
    });
    // todo: add check for linked calendars
    formattedMonth.hideLeftArrow =
        options.isDisabled ||
            (options.monthIndex > 0 && options.monthIndex !== options.displayMonths);
    formattedMonth.hideRightArrow =
        options.isDisabled ||
            (options.monthIndex < options.displayMonths &&
                options.monthIndex + 1 !== options.displayMonths);
    formattedMonth.disableLeftArrow = isMonthDisabled(shiftDate(formattedMonth.month, { month: -1 }), options.minDate, options.maxDate);
    formattedMonth.disableRightArrow = isMonthDisabled(shiftDate(formattedMonth.month, { month: 1 }), options.minDate, options.maxDate);
    return formattedMonth;
}
function isDateInRange(date, selectedRange, hoveredDate) {
    if (!date || !selectedRange[0]) {
        return false;
    }
    if (selectedRange[1]) {
        return date > selectedRange[0] && date <= selectedRange[1];
    }
    if (hoveredDate) {
        return date > selectedRange[0] && date <= hoveredDate;
    }
    return false;
}

function canSwitchMode(mode) {
    return true;
}

var height = 4;
var width = 3;
var shift = { month: 1 };
function formatMonthsCalendar(viewDate, formatOptions) {
    var initialDate = startOf(viewDate, 'year');
    var matrixOptions = { width: width, height: height, initialDate: initialDate, shift: shift };
    var monthMatrix = createMatrix(matrixOptions, function (date) { return ({
        date: date,
        label: formatDate(date, formatOptions.monthLabel, formatOptions.locale)
    }); });
    return {
        months: monthMatrix,
        monthTitle: '',
        yearTitle: formatDate(viewDate, formatOptions.yearTitle, formatOptions.locale)
    };
}

function flagMonthsCalendar(monthCalendar, options) {
    monthCalendar.months.forEach(function (months, rowIndex) {
        months.forEach(function (month, monthIndex) {
            var isHovered = isSameMonth(month.date, options.hoveredMonth);
            var isDisabled = options.isDisabled ||
                isMonthDisabled(month.date, options.minDate, options.maxDate);
            var newMonth = Object.assign(/*{},*/ month, {
                isHovered: isHovered,
                isDisabled: isDisabled
            });
            if (month.isHovered !== newMonth.isHovered ||
                month.isDisabled !== newMonth.isDisabled) {
                monthCalendar.months[rowIndex][monthIndex] = newMonth;
            }
        });
    });
    // todo: add check for linked calendars
    monthCalendar.hideLeftArrow =
        options.monthIndex > 0 && options.monthIndex !== options.displayMonths;
    monthCalendar.hideRightArrow =
        options.monthIndex < options.displayMonths &&
            options.monthIndex + 1 !== options.displayMonths;
    monthCalendar.disableLeftArrow = isYearDisabled(shiftDate(monthCalendar.months[0][0].date, { year: -1 }), options.minDate, options.maxDate);
    monthCalendar.disableRightArrow = isYearDisabled(shiftDate(monthCalendar.months[0][0].date, { year: 1 }), options.minDate, options.maxDate);
    return monthCalendar;
}

var height$1 = 4;
var width$1 = 4;
var yearsPerCalendar = height$1 * width$1;
var initialShift = (Math.floor(yearsPerCalendar / 2) - 1) * -1;
var shift$1 = { year: 1 };
function formatYearsCalendar(viewDate, formatOptions) {
    var initialDate = shiftDate(viewDate, { year: initialShift });
    var matrixOptions = { width: width$1, height: height$1, initialDate: initialDate, shift: shift$1 };
    var yearsMatrix = createMatrix(matrixOptions, function (date) { return ({
        date: date,
        label: formatDate(date, formatOptions.yearLabel, formatOptions.locale)
    }); });
    var yearTitle = formatYearRangeTitle(yearsMatrix, formatOptions);
    return {
        years: yearsMatrix,
        monthTitle: '',
        yearTitle: yearTitle
    };
}
function formatYearRangeTitle(yearsMatrix, formatOptions) {
    var from$$1 = formatDate(yearsMatrix[0][0].date, formatOptions.yearTitle, formatOptions.locale);
    var to = formatDate(yearsMatrix[height$1 - 1][width$1 - 1].date, formatOptions.yearTitle, formatOptions.locale);
    return from$$1 + " - " + to;
}

function flagYearsCalendar(yearsCalendar, options) {
    yearsCalendar.years.forEach(function (years, rowIndex) {
        years.forEach(function (year, yearIndex) {
            var isHovered = isSameYear(year.date, options.hoveredYear);
            var isDisabled = options.isDisabled ||
                isYearDisabled(year.date, options.minDate, options.maxDate);
            var newMonth = Object.assign(/*{},*/ year, { isHovered: isHovered, isDisabled: isDisabled });
            if (year.isHovered !== newMonth.isHovered ||
                year.isDisabled !== newMonth.isDisabled) {
                yearsCalendar.years[rowIndex][yearIndex] = newMonth;
            }
        });
    });
    // todo: add check for linked calendars
    yearsCalendar.hideLeftArrow =
        options.yearIndex > 0 && options.yearIndex !== options.displayMonths;
    yearsCalendar.hideRightArrow =
        options.yearIndex < options.displayMonths &&
            options.yearIndex + 1 !== options.displayMonths;
    yearsCalendar.disableLeftArrow = isYearDisabled(shiftDate(yearsCalendar.years[0][0].date, { year: -1 }), options.minDate, options.maxDate);
    var i = yearsCalendar.years.length - 1;
    var j = yearsCalendar.years[i].length - 1;
    yearsCalendar.disableRightArrow = isYearDisabled(shiftDate(yearsCalendar.years[i][j].date, { year: 1 }), options.minDate, options.maxDate);
    return yearsCalendar;
}

// tslint:disable:max-file-line-count
function bsDatepickerReducer(state, action) {
    if (state === void 0) { state = initialDatepickerState; }
    switch (action.type) {
        case BsDatepickerActions.CALCULATE: {
            return calculateReducer(state);
        }
        case BsDatepickerActions.FORMAT: {
            return formatReducer(state, action);
        }
        case BsDatepickerActions.FLAG: {
            return flagReducer(state, action);
        }
        case BsDatepickerActions.NAVIGATE_OFFSET: {
            var date = shiftDate(startOf(state.view.date, 'month'), action.payload);
            var newState = {
                view: {
                    mode: state.view.mode,
                    date: date
                }
            };
            return Object.assign({}, state, newState);
        }
        case BsDatepickerActions.NAVIGATE_TO: {
            var payload = action.payload;
            var date = setDate(state.view.date, payload.unit);
            var mode = payload.viewMode;
            var newState = { view: { date: date, mode: mode } };
            return Object.assign({}, state, newState);
        }
        case BsDatepickerActions.CHANGE_VIEWMODE: {
            if (!canSwitchMode(action.payload)) {
                return state;
            }
            var date = state.view.date;
            var mode = action.payload;
            var newState = { view: { date: date, mode: mode } };
            return Object.assign({}, state, newState);
        }
        case BsDatepickerActions.HOVER: {
            return Object.assign({}, state, { hoveredDate: action.payload });
        }
        case BsDatepickerActions.SELECT: {
            var newState = {
                selectedDate: action.payload,
                view: state.view
            };
            if (action.payload) {
                newState.view = {
                    date: action.payload,
                    mode: state.view.mode
                };
            }
            return Object.assign({}, state, newState);
        }
        case BsDatepickerActions.SET_OPTIONS: {
            var newState = action.payload;
            // looks not really good
            if (newState.value) {
                newState.view = state.view;
                if (isArray(newState.value)) {
                    newState.view = {
                        mode: state.view.mode,
                        date: isDateValid(newState.value[0]) ? newState.value[0] : newState.view.date
                    };
                    newState.selectedRange = newState.value;
                }
                else {
                    newState.view = {
                        mode: state.view.mode,
                        date: newState.value
                    };
                    newState.selectedDate = newState.value;
                }
            }
            return Object.assign({}, state, newState);
        }
        // date range picker
        case BsDatepickerActions.SELECT_RANGE: {
            return Object.assign({}, state, { selectedRange: action.payload });
        }
        case BsDatepickerActions.SET_MIN_DATE: {
            return Object.assign({}, state, {
                minDate: action.payload
            });
        }
        case BsDatepickerActions.SET_MAX_DATE: {
            return Object.assign({}, state, {
                maxDate: action.payload
            });
        }
        case BsDatepickerActions.SET_IS_DISABLED: {
            return Object.assign({}, state, {
                isDisabled: action.payload
            });
        }
        default:
            return state;
    }
}
function calculateReducer(state) {
    // how many calendars
    var displayMonths = state.displayMonths;
    // use selected date on initial rendering if set
    var viewDate = state.view.date;
    if (state.view.mode === 'day') {
        state.monthViewOptions.firstDayOfWeek = getLocale(state.locale).firstDayOfWeek();
        var monthsModel = new Array(displayMonths);
        for (var monthIndex = 0; monthIndex < displayMonths; monthIndex++) {
            // todo: for unlinked calendars it will be harder
            monthsModel[monthIndex] = calcDaysCalendar(viewDate, state.monthViewOptions);
            viewDate = shiftDate(viewDate, { month: 1 });
        }
        return Object.assign({}, state, { monthsModel: monthsModel });
    }
    if (state.view.mode === 'month') {
        var monthsCalendar = new Array(displayMonths);
        for (var calendarIndex = 0; calendarIndex < displayMonths; calendarIndex++) {
            // todo: for unlinked calendars it will be harder
            monthsCalendar[calendarIndex] = formatMonthsCalendar(viewDate, getFormatOptions(state));
            viewDate = shiftDate(viewDate, { year: 1 });
        }
        return Object.assign({}, state, { monthsCalendar: monthsCalendar });
    }
    if (state.view.mode === 'year') {
        var yearsCalendarModel = new Array(displayMonths);
        for (var calendarIndex = 0; calendarIndex < displayMonths; calendarIndex++) {
            // todo: for unlinked calendars it will be harder
            yearsCalendarModel[calendarIndex] = formatYearsCalendar(viewDate, getFormatOptions(state));
            viewDate = shiftDate(viewDate, { year: yearsPerCalendar });
        }
        return Object.assign({}, state, { yearsCalendarModel: yearsCalendarModel });
    }
    return state;
}
function formatReducer(state, action) {
    if (state.view.mode === 'day') {
        var formattedMonths = state.monthsModel.map(function (month, monthIndex) {
            return formatDaysCalendar(month, getFormatOptions(state), monthIndex);
        });
        return Object.assign({}, state, { formattedMonths: formattedMonths });
    }
    // how many calendars
    var displayMonths = state.displayMonths;
    // check initial rendering
    // use selected date on initial rendering if set
    var viewDate = state.view.date;
    if (state.view.mode === 'month') {
        var monthsCalendar = new Array(displayMonths);
        for (var calendarIndex = 0; calendarIndex < displayMonths; calendarIndex++) {
            // todo: for unlinked calendars it will be harder
            monthsCalendar[calendarIndex] = formatMonthsCalendar(viewDate, getFormatOptions(state));
            viewDate = shiftDate(viewDate, { year: 1 });
        }
        return Object.assign({}, state, { monthsCalendar: monthsCalendar });
    }
    if (state.view.mode === 'year') {
        var yearsCalendarModel = new Array(displayMonths);
        for (var calendarIndex = 0; calendarIndex < displayMonths; calendarIndex++) {
            // todo: for unlinked calendars it will be harder
            yearsCalendarModel[calendarIndex] = formatYearsCalendar(viewDate, getFormatOptions(state));
            viewDate = shiftDate(viewDate, { year: 16 });
        }
        return Object.assign({}, state, { yearsCalendarModel: yearsCalendarModel });
    }
    return state;
}
function flagReducer(state, action) {
    if (state.view.mode === 'day') {
        var flaggedMonths = state.formattedMonths.map(function (formattedMonth, monthIndex) {
            return flagDaysCalendar(formattedMonth, {
                isDisabled: state.isDisabled,
                minDate: state.minDate,
                maxDate: state.maxDate,
                hoveredDate: state.hoveredDate,
                selectedDate: state.selectedDate,
                selectedRange: state.selectedRange,
                displayMonths: state.displayMonths,
                monthIndex: monthIndex
            });
        });
        return Object.assign({}, state, { flaggedMonths: flaggedMonths });
    }
    if (state.view.mode === 'month') {
        var flaggedMonthsCalendar = state.monthsCalendar.map(function (formattedMonth, monthIndex) {
            return flagMonthsCalendar(formattedMonth, {
                isDisabled: state.isDisabled,
                minDate: state.minDate,
                maxDate: state.maxDate,
                hoveredMonth: state.hoveredMonth,
                displayMonths: state.displayMonths,
                monthIndex: monthIndex
            });
        });
        return Object.assign({}, state, { flaggedMonthsCalendar: flaggedMonthsCalendar });
    }
    if (state.view.mode === 'year') {
        var yearsCalendarFlagged = state.yearsCalendarModel.map(function (formattedMonth, yearIndex) {
            return flagYearsCalendar(formattedMonth, {
                isDisabled: state.isDisabled,
                minDate: state.minDate,
                maxDate: state.maxDate,
                hoveredYear: state.hoveredYear,
                displayMonths: state.displayMonths,
                yearIndex: yearIndex
            });
        });
        return Object.assign({}, state, { yearsCalendarFlagged: yearsCalendarFlagged });
    }
    return state;
}
function getFormatOptions(state) {
    return {
        locale: state.locale,
        monthTitle: state.monthTitle,
        yearTitle: state.yearTitle,
        dayLabel: state.dayLabel,
        monthLabel: state.monthLabel,
        yearLabel: state.yearLabel,
        weekNumbers: state.weekNumbers
    };
}

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BsDatepickerStore = (function (_super) {
    __extends(BsDatepickerStore, _super);
    function BsDatepickerStore() {
        var _this = this;
        var _dispatcher = new BehaviorSubject$1({
            type: '[datepicker] dispatcher init'
        });
        var state = new MiniState(initialDatepickerState, _dispatcher, bsDatepickerReducer);
        _this = _super.call(this, _dispatcher, bsDatepickerReducer, state) || this;
        return _this;
    }
    BsDatepickerStore.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BsDatepickerStore.ctorParameters = function () { return []; };
    return BsDatepickerStore;
}(MiniStore));

var BsDatepickerAbstractComponent = (function () {
    function BsDatepickerAbstractComponent() {
        this._customRangesFish = [];
    }
    Object.defineProperty(BsDatepickerAbstractComponent.prototype, "minDate", {
        set: function (value) {
            this._effects.setMinDate(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDatepickerAbstractComponent.prototype, "maxDate", {
        set: function (value) {
            this._effects.setMaxDate(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDatepickerAbstractComponent.prototype, "isDisabled", {
        set: function (value) {
            this._effects.setDisabled(value);
        },
        enumerable: true,
        configurable: true
    });
    BsDatepickerAbstractComponent.prototype.setViewMode = function (event) { };
    BsDatepickerAbstractComponent.prototype.navigateTo = function (event) { };
    BsDatepickerAbstractComponent.prototype.dayHoverHandler = function (event) { };
    BsDatepickerAbstractComponent.prototype.monthHoverHandler = function (event) { };
    BsDatepickerAbstractComponent.prototype.yearHoverHandler = function (event) { };
    BsDatepickerAbstractComponent.prototype.daySelectHandler = function (day) { };
    BsDatepickerAbstractComponent.prototype.monthSelectHandler = function (event) { };
    BsDatepickerAbstractComponent.prototype.yearSelectHandler = function (event) { };
    BsDatepickerAbstractComponent.prototype._stopPropagation = function (event) {
        event.stopPropagation();
    };
    return BsDatepickerAbstractComponent;
}());

var BsDatepickerEffects = (function () {
    function BsDatepickerEffects(_actions) {
        this._actions = _actions;
        this._subs = [];
    }
    BsDatepickerEffects.prototype.init = function (_bsDatepickerStore) {
        this._store = _bsDatepickerStore;
        return this;
    };
    /** setters */
    BsDatepickerEffects.prototype.setValue = function (value) {
        this._store.dispatch(this._actions.select(value));
    };
    BsDatepickerEffects.prototype.setRangeValue = function (value) {
        this._store.dispatch(this._actions.selectRange(value));
    };
    BsDatepickerEffects.prototype.setMinDate = function (value) {
        this._store.dispatch(this._actions.minDate(value));
        return this;
    };
    BsDatepickerEffects.prototype.setMaxDate = function (value) {
        this._store.dispatch(this._actions.maxDate(value));
        return this;
    };
    BsDatepickerEffects.prototype.setDisabled = function (value) {
        this._store.dispatch(this._actions.isDisabled(value));
        return this;
    };
    /* Set rendering options */
    BsDatepickerEffects.prototype.setOptions = function (_config) {
        this._store.dispatch(this._actions.setOptions(_config));
        return this;
    };
    /** view to mode bindings */
    BsDatepickerEffects.prototype.setBindings = function (container) {
        container.daysCalendar = this._store
            .select(function (state) { return state.flaggedMonths; })
            .filter(function (months) { return !!months; });
        // month calendar
        container.monthsCalendar = this._store
            .select(function (state) { return state.flaggedMonthsCalendar; })
            .filter(function (months) { return !!months; });
        // year calendar
        container.yearsCalendar = this._store
            .select(function (state) { return state.yearsCalendarFlagged; })
            .filter(function (years) { return !!years; });
        container.viewMode = this._store.select(function (state) { return state.view.mode; });
        container.options = this._store
            .select(function (state) { return state.showWeekNumbers; })
            .map(function (showWeekNumbers) { return ({ showWeekNumbers: showWeekNumbers }); });
        return this;
    };
    /** event handlers */
    BsDatepickerEffects.prototype.setEventHandlers = function (container) {
        var _this = this;
        container.setViewMode = function (event) {
            _this._store.dispatch(_this._actions.changeViewMode(event));
        };
        container.navigateTo = function (event) {
            _this._store.dispatch(_this._actions.navigateStep(event.step));
        };
        container.dayHoverHandler = function (event) {
            var _cell = event.cell;
            if (_cell.isOtherMonth || _cell.isDisabled) {
                return;
            }
            _this._store.dispatch(_this._actions.hoverDay(event));
            _cell.isHovered = event.isHovered;
        };
        container.monthHoverHandler = function (event) {
            event.cell.isHovered = event.isHovered;
        };
        container.yearHoverHandler = function (event) {
            event.cell.isHovered = event.isHovered;
        };
        /** select handlers */
        // container.daySelectHandler = (day: DayViewModel): void => {
        //   if (day.isOtherMonth || day.isDisabled) {
        //     return;
        //   }
        //   this._store.dispatch(this._actions.select(day.date));
        // };
        container.monthSelectHandler = function (event) {
            if (event.isDisabled) {
                return;
            }
            _this._store.dispatch(_this._actions.navigateTo({
                unit: { month: getMonth(event.date) },
                viewMode: 'day'
            }));
        };
        container.yearSelectHandler = function (event) {
            if (event.isDisabled) {
                return;
            }
            _this._store.dispatch(_this._actions.navigateTo({
                unit: { year: getFullYear(event.date) },
                viewMode: 'month'
            }));
        };
        return this;
    };
    BsDatepickerEffects.prototype.registerDatepickerSideEffects = function () {
        var _this = this;
        this._subs.push(this._store.select(function (state) { return state.view; }).subscribe(function (view) {
            _this._store.dispatch(_this._actions.calculate());
        }));
        // format calendar values on month model change
        this._subs.push(this._store
            .select(function (state) { return state.monthsModel; })
            .filter(function (monthModel) { return !!monthModel; })
            .subscribe(function (month) { return _this._store.dispatch(_this._actions.format()); }));
        // flag day values
        this._subs.push(this._store
            .select(function (state) { return state.formattedMonths; })
            .filter(function (month) { return !!month; })
            .subscribe(function (month) { return _this._store.dispatch(_this._actions.flag()); }));
        // flag day values
        this._subs.push(this._store
            .select(function (state) { return state.selectedDate; })
            .filter(function (selectedDate) { return !!selectedDate; })
            .subscribe(function (selectedDate) { return _this._store.dispatch(_this._actions.flag()); }));
        // flag for date range picker
        this._subs.push(this._store
            .select(function (state) { return state.selectedRange; })
            .filter(function (selectedRange) { return !!selectedRange; })
            .subscribe(function (selectedRange) { return _this._store.dispatch(_this._actions.flag()); }));
        // monthsCalendar
        this._subs.push(this._store
            .select(function (state) { return state.monthsCalendar; })
            .subscribe(function () { return _this._store.dispatch(_this._actions.flag()); }));
        // years calendar
        this._subs.push(this._store
            .select(function (state) { return state.yearsCalendarModel; })
            .filter(function (state) { return !!state; })
            .subscribe(function () { return _this._store.dispatch(_this._actions.flag()); }));
        // on hover
        this._subs.push(this._store
            .select(function (state) { return state.hoveredDate; })
            .filter(function (hoveredDate) { return !!hoveredDate; })
            .subscribe(function (hoveredDate) { return _this._store.dispatch(_this._actions.flag()); }));
        return this;
    };
    BsDatepickerEffects.prototype.destroy = function () {
        for (var _i = 0, _a = this._subs; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
    };
    BsDatepickerEffects.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BsDatepickerEffects.ctorParameters = function () { return [
        { type: BsDatepickerActions, },
    ]; };
    return BsDatepickerEffects;
}());

var __extends$9 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BsDatepickerContainerComponent = (function (_super) {
    __extends$9(BsDatepickerContainerComponent, _super);
    function BsDatepickerContainerComponent(_config, _store, _actions, _effects) {
        var _this = _super.call(this) || this;
        _this._config = _config;
        _this._store = _store;
        _this._actions = _actions;
        _this.valueChange = new EventEmitter();
        _this._subs = [];
        _this._effects = _effects;
        return _this;
    }
    Object.defineProperty(BsDatepickerContainerComponent.prototype, "value", {
        set: function (value) {
            this._effects.setValue(value);
        },
        enumerable: true,
        configurable: true
    });
    BsDatepickerContainerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.containerClass = this._config.containerClass;
        this._effects
            .init(this._store)
            .setOptions(this._config)
            .setBindings(this)
            .setEventHandlers(this)
            .registerDatepickerSideEffects();
        // todo: move it somewhere else
        // on selected date change
        this._subs.push(this._store
            .select(function (state) { return state.selectedDate; })
            .subscribe(function (date) { return _this.valueChange.emit(date); }));
    };
    BsDatepickerContainerComponent.prototype.daySelectHandler = function (day) {
        if (day.isOtherMonth || day.isDisabled) {
            return;
        }
        this._store.dispatch(this._actions.select(day.date));
    };
    BsDatepickerContainerComponent.prototype.ngOnDestroy = function () {
        for (var _i = 0, _a = this._subs; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
        this._effects.destroy();
    };
    BsDatepickerContainerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-datepicker-container',
                    providers: [BsDatepickerStore, BsDatepickerEffects],
                    template: "<!-- days calendar view mode --> <div class=\"bs-datepicker\" [ngClass]=\"containerClass\" *ngIf=\"viewMode | async\"> <div class=\"bs-datepicker-container\"> <!--calendars--> <div class=\"bs-calendar-container\" [ngSwitch]=\"viewMode | async\"> <!--days calendar--> <div *ngSwitchCase=\"'day'\"> <bs-days-calendar-view *ngFor=\"let calendar of (daysCalendar | async)\" [class.bs-datepicker-multiple]=\"(daysCalendar | async).length > 1\" [calendar]=\"calendar\" [options]=\"options | async\" (onNavigate)=\"navigateTo($event)\" (onViewMode)=\"setViewMode($event)\" (onHover)=\"dayHoverHandler($event)\" (onSelect)=\"daySelectHandler($event)\" ></bs-days-calendar-view> </div> <!--months calendar--> <div *ngSwitchCase=\"'month'\"> <bs-month-calendar-view *ngFor=\"let calendar of (monthsCalendar   | async)\" [class.bs-datepicker-multiple]=\"(daysCalendar   | async).length > 1\" [calendar]=\"calendar\" (onNavigate)=\"navigateTo($event)\" (onViewMode)=\"setViewMode($event)\" (onHover)=\"monthHoverHandler($event)\" (onSelect)=\"monthSelectHandler($event)\" ></bs-month-calendar-view> </div> <!--years calendar--> <div *ngSwitchCase=\"'year'\"> <bs-years-calendar-view *ngFor=\"let calendar of (yearsCalendar   | async)\" [class.bs-datepicker-multiple]=\"(daysCalendar | async).length > 1\" [calendar]=\"calendar\" (onNavigate)=\"navigateTo($event)\" (onViewMode)=\"setViewMode($event)\" (onHover)=\"yearHoverHandler($event)\" (onSelect)=\"yearSelectHandler($event)\" ></bs-years-calendar-view> </div> </div> <!--applycancel buttons--> <div class=\"bs-datepicker-buttons\" *ngIf=\"false\"> <button class=\"btn btn-success\">Apply</button> <button class=\"btn btn-default\">Cancel</button> </div> </div> <!--custom dates or date ranges picker--> <div class=\"bs-datepicker-custom-range\" *ngIf=\"false\"> <bs-custom-date-view [ranges]=\"_customRangesFish\"></bs-custom-date-view> </div> </div> ",
                    host: {
                        '(click)': '_stopPropagation($event)',
                        style: 'position: absolute; display: block;'
                    }
                },] },
    ];
    /** @nocollapse */
    BsDatepickerContainerComponent.ctorParameters = function () { return [
        { type: BsDatepickerConfig, },
        { type: BsDatepickerStore, },
        { type: BsDatepickerActions, },
        { type: BsDatepickerEffects, },
    ]; };
    return BsDatepickerContainerComponent;
}(BsDatepickerAbstractComponent));

/** *************** */
// events
/** *************** */
var BsNavigationDirection;
(function (BsNavigationDirection) {
    BsNavigationDirection[BsNavigationDirection["UP"] = 0] = "UP";
    BsNavigationDirection[BsNavigationDirection["DOWN"] = 1] = "DOWN";
})(BsNavigationDirection || (BsNavigationDirection = {}));

var BsDatepickerNavigationViewComponent = (function () {
    function BsDatepickerNavigationViewComponent() {
        this.onNavigate = new EventEmitter();
        this.onViewMode = new EventEmitter();
    }
    BsDatepickerNavigationViewComponent.prototype.navTo = function (down) {
        this.onNavigate.emit(down ? BsNavigationDirection.DOWN : BsNavigationDirection.UP);
    };
    BsDatepickerNavigationViewComponent.prototype.view = function (viewMode) {
        this.onViewMode.emit(viewMode);
    };
    BsDatepickerNavigationViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-datepicker-navigation-view',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: "\n    <button class=\"previous\"\n            [disabled]=\"calendar.disableLeftArrow\"\n            [style.visibility]=\"calendar.hideLeftArrow ? 'hidden' : 'visible'\"\n            (click)=\"navTo(true)\"><span>&lsaquo;</span>\n    </button>\n\n    <button class=\"current\"\n            *ngIf=\"calendar.monthTitle\"\n            (click)=\"view('month')\"\n    ><span>{{ calendar.monthTitle }}</span>\n    </button>\n\n    <button class=\"current\" (click)=\"view('year')\"\n    ><span>{{ calendar.yearTitle }}</span></button>\n\n    <button class=\"next\"\n            [disabled]=\"calendar.disableRightArrow\"\n            [style.visibility]=\"calendar.hideRightArrow ? 'hidden' : 'visible'\"\n            (click)=\"navTo(false)\"><span>&rsaquo;</span>\n    </button>\n  "
                },] },
    ];
    /** @nocollapse */
    BsDatepickerNavigationViewComponent.ctorParameters = function () { return []; };
    BsDatepickerNavigationViewComponent.propDecorators = {
        'calendar': [{ type: Input },],
        'onNavigate': [{ type: Output },],
        'onViewMode': [{ type: Output },],
    };
    return BsDatepickerNavigationViewComponent;
}());

var BsDaysCalendarViewComponent = (function () {
    function BsDaysCalendarViewComponent() {
        this.onNavigate = new EventEmitter();
        this.onViewMode = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.onHover = new EventEmitter();
    }
    BsDaysCalendarViewComponent.prototype.navigateTo = function (event) {
        var step = BsNavigationDirection.DOWN === event ? -1 : 1;
        this.onNavigate.emit({ step: { month: step } });
    };
    BsDaysCalendarViewComponent.prototype.changeViewMode = function (event) {
        this.onViewMode.emit(event);
    };
    BsDaysCalendarViewComponent.prototype.selectDay = function (event) {
        this.onSelect.emit(event);
    };
    BsDaysCalendarViewComponent.prototype.hoverDay = function (cell, isHovered) {
        this.onHover.emit({ cell: cell, isHovered: isHovered });
    };
    BsDaysCalendarViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-days-calendar-view',
                    // changeDetection: ChangeDetectionStrategy.OnPush,
                    template: "\n    <bs-calendar-layout>\n      <bs-datepicker-navigation-view\n        [calendar]=\"calendar\"\n        (onNavigate)=\"navigateTo($event)\"\n        (onViewMode)=\"changeViewMode($event)\"\n      ></bs-datepicker-navigation-view>\n\n      <!--days matrix-->\n      <table role=\"grid\" class=\"days weeks\">\n        <thead>\n        <tr>\n          <!--if show weeks-->\n          <th *ngIf=\"options.showWeekNumbers\"></th>\n          <th *ngFor=\"let weekday of calendar.weekdays; let i = index\"\n              aria-label=\"weekday\">{{ calendar.weekdays[i] }}\n          </th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr *ngFor=\"let week of calendar.weeks; let i = index\">\n          <td class=\"week\" *ngIf=\"options.showWeekNumbers\">\n            <span>{{ calendar.weekNumbers[i] }}</span>\n          </td>\n          <td *ngFor=\"let day of week.days\" role=\"gridcell\">\n          <span bsDatepickerDayDecorator\n                [day]=\"day\"\n                (click)=\"selectDay(day)\"\n                (mouseenter)=\"hoverDay(day, true)\"\n                (mouseleave)=\"hoverDay(day, false)\">{{ day.label }}</span>\n          </td>\n        </tr>\n        </tbody>\n      </table>\n\n    </bs-calendar-layout>\n  "
                },] },
    ];
    /** @nocollapse */
    BsDaysCalendarViewComponent.ctorParameters = function () { return []; };
    BsDaysCalendarViewComponent.propDecorators = {
        'calendar': [{ type: Input },],
        'options': [{ type: Input },],
        'onNavigate': [{ type: Output },],
        'onViewMode': [{ type: Output },],
        'onSelect': [{ type: Output },],
        'onHover': [{ type: Output },],
    };
    return BsDaysCalendarViewComponent;
}());

var __extends$10 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BsDaterangepickerContainerComponent = (function (_super) {
    __extends$10(BsDaterangepickerContainerComponent, _super);
    function BsDaterangepickerContainerComponent(_config, _store, _actions, _effects) {
        var _this = _super.call(this) || this;
        _this._config = _config;
        _this._store = _store;
        _this._actions = _actions;
        _this.valueChange = new EventEmitter();
        _this._rangeStack = [];
        _this._subs = [];
        _this._effects = _effects;
        return _this;
    }
    Object.defineProperty(BsDaterangepickerContainerComponent.prototype, "value", {
        set: function (value) {
            this._effects.setRangeValue(value);
        },
        enumerable: true,
        configurable: true
    });
    BsDaterangepickerContainerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.containerClass = this._config.containerClass;
        this._effects
            .init(this._store)
            .setOptions(this._config)
            .setBindings(this)
            .setEventHandlers(this)
            .registerDatepickerSideEffects();
        // todo: move it somewhere else
        // on selected date change
        this._subs.push(this._store
            .select(function (state) { return state.selectedRange; })
            .subscribe(function (date) { return _this.valueChange.emit(date); }));
    };
    BsDaterangepickerContainerComponent.prototype.daySelectHandler = function (day) {
        if (day.isOtherMonth || day.isDisabled) {
            return;
        }
        // if only one date is already selected
        // and user clicks on previous date
        // start selection from new date
        // but if new date is after initial one
        // than finish selection
        if (this._rangeStack.length === 1) {
            this._rangeStack =
                day.date >= this._rangeStack[0]
                    ? [this._rangeStack[0], day.date]
                    : [day.date];
        }
        if (this._rangeStack.length === 0) {
            this._rangeStack = [day.date];
        }
        this._store.dispatch(this._actions.selectRange(this._rangeStack));
        if (this._rangeStack.length === 2) {
            this._rangeStack = [];
        }
    };
    BsDaterangepickerContainerComponent.prototype.ngOnDestroy = function () {
        for (var _i = 0, _a = this._subs; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
        this._effects.destroy();
    };
    BsDaterangepickerContainerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-daterangepicker-container',
                    providers: [BsDatepickerStore, BsDatepickerEffects],
                    template: "<!-- days calendar view mode --> <div class=\"bs-datepicker\" [ngClass]=\"containerClass\" *ngIf=\"viewMode | async\"> <div class=\"bs-datepicker-container\"> <!--calendars--> <div class=\"bs-calendar-container\" [ngSwitch]=\"viewMode | async\"> <!--days calendar--> <div *ngSwitchCase=\"'day'\"> <bs-days-calendar-view *ngFor=\"let calendar of (daysCalendar | async)\" [class.bs-datepicker-multiple]=\"(daysCalendar | async).length > 1\" [calendar]=\"calendar\" [options]=\"options | async\" (onNavigate)=\"navigateTo($event)\" (onViewMode)=\"setViewMode($event)\" (onHover)=\"dayHoverHandler($event)\" (onSelect)=\"daySelectHandler($event)\" ></bs-days-calendar-view> </div> <!--months calendar--> <div *ngSwitchCase=\"'month'\"> <bs-month-calendar-view *ngFor=\"let calendar of (monthsCalendar   | async)\" [class.bs-datepicker-multiple]=\"(daysCalendar   | async).length > 1\" [calendar]=\"calendar\" (onNavigate)=\"navigateTo($event)\" (onViewMode)=\"setViewMode($event)\" (onHover)=\"monthHoverHandler($event)\" (onSelect)=\"monthSelectHandler($event)\" ></bs-month-calendar-view> </div> <!--years calendar--> <div *ngSwitchCase=\"'year'\"> <bs-years-calendar-view *ngFor=\"let calendar of (yearsCalendar   | async)\" [class.bs-datepicker-multiple]=\"(daysCalendar | async).length > 1\" [calendar]=\"calendar\" (onNavigate)=\"navigateTo($event)\" (onViewMode)=\"setViewMode($event)\" (onHover)=\"yearHoverHandler($event)\" (onSelect)=\"yearSelectHandler($event)\" ></bs-years-calendar-view> </div> </div> <!--applycancel buttons--> <div class=\"bs-datepicker-buttons\" *ngIf=\"false\"> <button class=\"btn btn-success\">Apply</button> <button class=\"btn btn-default\">Cancel</button> </div> </div> <!--custom dates or date ranges picker--> <div class=\"bs-datepicker-custom-range\" *ngIf=\"false\"> <bs-custom-date-view [ranges]=\"_customRangesFish\"></bs-custom-date-view> </div> </div> ",
                    host: {
                        '(click)': '_stopPropagation($event)',
                        style: 'position: absolute; display: block;'
                    }
                },] },
    ];
    /** @nocollapse */
    BsDaterangepickerContainerComponent.ctorParameters = function () { return [
        { type: BsDatepickerConfig, },
        { type: BsDatepickerStore, },
        { type: BsDatepickerActions, },
        { type: BsDatepickerEffects, },
    ]; };
    return BsDaterangepickerContainerComponent;
}(BsDatepickerAbstractComponent));

var DEFAULT_ALIASES = {
    hover: ['mouseover', 'mouseout'],
    focus: ['focusin', 'focusout']
};
function parseTriggers(triggers, aliases) {
    if (aliases === void 0) { aliases = DEFAULT_ALIASES; }
    var trimmedTriggers = (triggers || '').trim();
    if (trimmedTriggers.length === 0) {
        return [];
    }
    var parsedTriggers = trimmedTriggers
        .split(/\s+/)
        .map(function (trigger) { return trigger.split(':'); })
        .map(function (triggerPair) {
        var alias = aliases[triggerPair[0]] || triggerPair;
        return new Trigger(alias[0], alias[1]);
    });
    var manualTriggers = parsedTriggers.filter(function (triggerPair) {
        return triggerPair.isManual();
    });
    if (manualTriggers.length > 1) {
        throw new Error('Triggers parse error: only one manual trigger is allowed');
    }
    if (manualTriggers.length === 1 && parsedTriggers.length > 1) {
        throw new Error('Triggers parse error: manual trigger can\'t be mixed with other triggers');
    }
    return parsedTriggers;
}

function listenToTriggersV2(renderer, options) {
    var parsedTriggers = parseTriggers(options.triggers);
    var target = options.target;
    // do nothing
    if (parsedTriggers.length === 1 && parsedTriggers[0].isManual()) {
        return Function.prototype;
    }
    // all listeners
    var listeners = [];
    // lazy listeners registration
    var _registerHide = [];
    var registerHide = function () {
        // add hide listeners to unregister array
        _registerHide.forEach(function (fn) { return listeners.push(fn()); });
        // register hide events only once
        _registerHide.length = 0;
    };
    // register open\close\toggle listeners
    parsedTriggers.forEach(function (trigger) {
        var useToggle = trigger.open === trigger.close;
        var showFn = useToggle ? options.toggle : options.show;
        if (!useToggle) {
            _registerHide.push(function () {
                return renderer.listen(target, trigger.close, options.hide);
            });
        }
        listeners.push(renderer.listen(target, trigger.open, function () { return showFn(registerHide); }));
    });
    return function () {
        listeners.forEach(function (unsubscribeFn) { return unsubscribeFn(); });
    };
}
function registerOutsideClick(renderer, options) {
    if (!options.outsideClick) {
        return Function.prototype;
    }
    return renderer.listen('document', 'click', function (event) {
        if (options.target && options.target.contains(event.target)) {
            return;
        }
        if (options.targets &&
            options.targets.some(function (target) { return target.contains(event.target); })) {
            return;
        }
        options.hide();
    });
}

/**
 * @copyright Valor Software
 * @copyright Angular ng-bootstrap team
 */
var ContentRef = (function () {
    function ContentRef(nodes, viewRef, componentRef) {
        this.nodes = nodes;
        this.viewRef = viewRef;
        this.componentRef = componentRef;
    }
    return ContentRef;
}());

// tslint:disable:max-file-line-count
// todo: add delay support
// todo: merge events onShow, onShown, etc...
// todo: add global positioning configuration?
var ComponentLoader = (function () {
    /**
     * Do not use this directly, it should be instanced via
     * `ComponentLoadFactory.attach`
     * @internal
     */
    // tslint:disable-next-line
    function ComponentLoader(_viewContainerRef, _renderer, _elementRef, _injector, _componentFactoryResolver, _ngZone, _applicationRef, _posService) {
        this._viewContainerRef = _viewContainerRef;
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._injector = _injector;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._ngZone = _ngZone;
        this._applicationRef = _applicationRef;
        this._posService = _posService;
        this.onBeforeShow = new EventEmitter();
        this.onShown = new EventEmitter();
        this.onBeforeHide = new EventEmitter();
        this.onHidden = new EventEmitter();
        this._providers = [];
        this._isHiding = false;
        this._listenOpts = {};
        this._globalListener = Function.prototype;
    }
    Object.defineProperty(ComponentLoader.prototype, "isShown", {
        get: function () {
            if (this._isHiding) {
                return false;
            }
            return !!this._componentRef;
        },
        enumerable: true,
        configurable: true
    });
    ComponentLoader.prototype.attach = function (compType) {
        this._componentFactory = this._componentFactoryResolver
            .resolveComponentFactory(compType);
        return this;
    };
    // todo: add behaviour: to target element, `body`, custom element
    ComponentLoader.prototype.to = function (container) {
        this.container = container || this.container;
        return this;
    };
    ComponentLoader.prototype.position = function (opts) {
        this.attachment = opts.attachment || this.attachment;
        this._elementRef = opts.target || this._elementRef;
        return this;
    };
    ComponentLoader.prototype.provide = function (provider) {
        this._providers.push(provider);
        return this;
    };
    // todo: appendChild to element or document.querySelector(this.container)
    ComponentLoader.prototype.show = function (opts) {
        if (opts === void 0) { opts = {}; }
        this._subscribePositioning();
        this._innerComponent = null;
        if (!this._componentRef) {
            this.onBeforeShow.emit();
            this._contentRef = this._getContentRef(opts.content, opts.context);
            var injector = ReflectiveInjector.resolveAndCreate(this._providers, this._injector);
            this._componentRef = this._componentFactory.create(injector, this._contentRef.nodes);
            this._applicationRef.attachView(this._componentRef.hostView);
            // this._componentRef = this._viewContainerRef
            //   .createComponent(this._componentFactory, 0, injector, this._contentRef.nodes);
            this.instance = this._componentRef.instance;
            Object.assign(this._componentRef.instance, opts);
            if (this.container instanceof ElementRef) {
                this.container.nativeElement.appendChild(this._componentRef.location.nativeElement);
            }
            if (this.container === 'body' && typeof document !== 'undefined') {
                document
                    .querySelector(this.container)
                    .appendChild(this._componentRef.location.nativeElement);
            }
            if (!this.container &&
                this._elementRef &&
                this._elementRef.nativeElement.parentElement) {
                this._elementRef.nativeElement.parentElement.appendChild(this._componentRef.location.nativeElement);
            }
            // we need to manually invoke change detection since events registered
            // via
            // Renderer::listen() are not picked up by change detection with the
            // OnPush strategy
            if (this._contentRef.componentRef) {
                this._innerComponent = this._contentRef.componentRef.instance;
                this._contentRef.componentRef.changeDetectorRef.markForCheck();
                this._contentRef.componentRef.changeDetectorRef.detectChanges();
            }
            this._componentRef.changeDetectorRef.markForCheck();
            this._componentRef.changeDetectorRef.detectChanges();
            this.onShown.emit(this._componentRef.instance);
        }
        this._registerOutsideClick();
        return this._componentRef;
    };
    ComponentLoader.prototype.hide = function () {
        if (!this._componentRef) {
            return this;
        }
        this.onBeforeHide.emit(this._componentRef.instance);
        var componentEl = this._componentRef.location.nativeElement;
        componentEl.parentNode.removeChild(componentEl);
        if (this._contentRef.componentRef) {
            this._contentRef.componentRef.destroy();
        }
        this._componentRef.destroy();
        if (this._viewContainerRef && this._contentRef.viewRef) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._contentRef.viewRef));
        }
        // this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._componentRef.hostView));
        //
        // if (this._contentRef.viewRef && this._viewContainerRef.indexOf(this._contentRef.viewRef) !== -1) {
        //   this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._contentRef.viewRef));
        // }
        this._contentRef = null;
        this._componentRef = null;
        this._removeGlobalListener();
        this.onHidden.emit();
        return this;
    };
    ComponentLoader.prototype.toggle = function () {
        if (this.isShown) {
            this.hide();
            return;
        }
        this.show();
    };
    ComponentLoader.prototype.dispose = function () {
        if (this.isShown) {
            this.hide();
        }
        this._unsubscribePositioning();
        if (this._unregisterListenersFn) {
            this._unregisterListenersFn();
        }
    };
    ComponentLoader.prototype.listen = function (listenOpts) {
        var _this = this;
        this.triggers = listenOpts.triggers || this.triggers;
        this._listenOpts.outsideClick = listenOpts.outsideClick;
        listenOpts.target = listenOpts.target || this._elementRef.nativeElement;
        var hide = (this._listenOpts.hide = function () {
            return listenOpts.hide ? listenOpts.hide() : void _this.hide();
        });
        var show = (this._listenOpts.show = function (registerHide) {
            listenOpts.show ? listenOpts.show(registerHide) : _this.show(registerHide);
            registerHide();
        });
        var toggle = function (registerHide) {
            _this.isShown ? hide() : show(registerHide);
        };
        this._unregisterListenersFn = listenToTriggersV2(this._renderer, {
            target: listenOpts.target,
            triggers: listenOpts.triggers,
            show: show,
            hide: hide,
            toggle: toggle
        });
        return this;
    };
    ComponentLoader.prototype._removeGlobalListener = function () {
        if (this._globalListener) {
            this._globalListener();
            this._globalListener = null;
        }
    };
    ComponentLoader.prototype.attachInline = function (vRef, template) {
        this._inlineViewRef = vRef.createEmbeddedView(template);
        return this;
    };
    ComponentLoader.prototype._registerOutsideClick = function () {
        var _this = this;
        if (!this._componentRef || !this._componentRef.location) {
            return;
        }
        // why: should run after first event bubble
        if (this._listenOpts.outsideClick) {
            var target_1 = this._componentRef.location.nativeElement;
            setTimeout(function () {
                _this._globalListener = registerOutsideClick(_this._renderer, {
                    targets: [target_1, _this._elementRef.nativeElement],
                    outsideClick: _this._listenOpts.outsideClick,
                    hide: function () { return _this._listenOpts.hide(); }
                });
            });
        }
    };
    ComponentLoader.prototype.getInnerComponent = function () {
        return this._innerComponent;
    };
    ComponentLoader.prototype._subscribePositioning = function () {
        var _this = this;
        if (this._zoneSubscription || !this.attachment) {
            return;
        }
        this._zoneSubscription = this._ngZone.onStable.subscribe(function () {
            if (!_this._componentRef) {
                return;
            }
            _this._posService.position({
                element: _this._componentRef.location,
                target: _this._elementRef,
                attachment: _this.attachment,
                appendToBody: _this.container === 'body'
            });
        });
    };
    ComponentLoader.prototype._unsubscribePositioning = function () {
        if (!this._zoneSubscription) {
            return;
        }
        this._zoneSubscription.unsubscribe();
        this._zoneSubscription = null;
    };
    ComponentLoader.prototype._getContentRef = function (content, context) {
        if (!content) {
            return new ContentRef([]);
        }
        if (content instanceof TemplateRef) {
            if (this._viewContainerRef) {
                var _viewRef = this._viewContainerRef
                    .createEmbeddedView(content, context);
                _viewRef.markForCheck();
                return new ContentRef([_viewRef.rootNodes], _viewRef);
            }
            var viewRef = content.createEmbeddedView({});
            this._applicationRef.attachView(viewRef);
            return new ContentRef([viewRef.rootNodes], viewRef);
        }
        if (typeof content === 'function') {
            var contentCmptFactory = this._componentFactoryResolver.resolveComponentFactory(content);
            var modalContentInjector = ReflectiveInjector.resolveAndCreate(this._providers.slice(), this._injector);
            var componentRef = contentCmptFactory.create(modalContentInjector);
            this._applicationRef.attachView(componentRef.hostView);
            return new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
        }
        return new ContentRef([[this._renderer.createText("" + content)]]);
    };
    return ComponentLoader;
}());

/**
 * @copyright Valor Software
 * @copyright Angular ng-bootstrap team
 */
// previous version:
// https://github.com/angular-ui/bootstrap/blob/07c31d0731f7cb068a1932b8e01d2312b796b4ec/src/position/position.js
// tslint:disable
var Positioning = (function () {
    function Positioning() {
    }
    Positioning.prototype.position = function (element, round) {
        if (round === void 0) { round = true; }
        var elPosition;
        var parentOffset = {
            width: 0,
            height: 0,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        };
        if (this.getStyle(element, 'position') === 'fixed') {
            var bcRect = element.getBoundingClientRect();
            elPosition = {
                width: bcRect.width,
                height: bcRect.height,
                top: bcRect.top,
                bottom: bcRect.bottom,
                left: bcRect.left,
                right: bcRect.right
            };
        }
        else {
            var offsetParentEl = this.offsetParent(element);
            elPosition = this.offset(element, false);
            if (offsetParentEl !== document.documentElement) {
                parentOffset = this.offset(offsetParentEl, false);
            }
            parentOffset.top += offsetParentEl.clientTop;
            parentOffset.left += offsetParentEl.clientLeft;
        }
        elPosition.top -= parentOffset.top;
        elPosition.bottom -= parentOffset.top;
        elPosition.left -= parentOffset.left;
        elPosition.right -= parentOffset.left;
        if (round) {
            elPosition.top = Math.round(elPosition.top);
            elPosition.bottom = Math.round(elPosition.bottom);
            elPosition.left = Math.round(elPosition.left);
            elPosition.right = Math.round(elPosition.right);
        }
        return elPosition;
    };
    Positioning.prototype.offset = function (element, round) {
        if (round === void 0) { round = true; }
        var elBcr = element.getBoundingClientRect();
        var viewportOffset = {
            top: window.pageYOffset - document.documentElement.clientTop,
            left: window.pageXOffset - document.documentElement.clientLeft
        };
        var elOffset = {
            height: elBcr.height || element.offsetHeight,
            width: elBcr.width || element.offsetWidth,
            top: elBcr.top + viewportOffset.top,
            bottom: elBcr.bottom + viewportOffset.top,
            left: elBcr.left + viewportOffset.left,
            right: elBcr.right + viewportOffset.left
        };
        if (round) {
            elOffset.height = Math.round(elOffset.height);
            elOffset.width = Math.round(elOffset.width);
            elOffset.top = Math.round(elOffset.top);
            elOffset.bottom = Math.round(elOffset.bottom);
            elOffset.left = Math.round(elOffset.left);
            elOffset.right = Math.round(elOffset.right);
        }
        return elOffset;
    };
    Positioning.prototype.positionElements = function (hostElement, targetElement, placement, appendToBody) {
        var hostElPosition = appendToBody
            ? this.offset(hostElement, false)
            : this.position(hostElement, false);
        var targetElStyles = this.getAllStyles(targetElement);
        var shiftWidth = {
            left: hostElPosition.left,
            center: hostElPosition.left +
                hostElPosition.width / 2 -
                targetElement.offsetWidth / 2,
            right: hostElPosition.left + hostElPosition.width
        };
        var shiftHeight = {
            top: hostElPosition.top,
            center: hostElPosition.top +
                hostElPosition.height / 2 -
                targetElement.offsetHeight / 2,
            bottom: hostElPosition.top + hostElPosition.height
        };
        var targetElBCR = targetElement.getBoundingClientRect();
        var placementPrimary = placement.split(' ')[0] || 'top';
        var placementSecondary = placement.split(' ')[1] || 'center';
        var targetElPosition = {
            height: targetElBCR.height || targetElement.offsetHeight,
            width: targetElBCR.width || targetElement.offsetWidth,
            top: 0,
            bottom: targetElBCR.height || targetElement.offsetHeight,
            left: 0,
            right: targetElBCR.width || targetElement.offsetWidth
        };
        if (placementPrimary === 'auto') {
            var newPlacementPrimary = this.autoPosition(targetElPosition, hostElPosition, targetElement, placementSecondary);
            if (!newPlacementPrimary)
                newPlacementPrimary = this.autoPosition(targetElPosition, hostElPosition, targetElement);
            if (newPlacementPrimary)
                placementPrimary = newPlacementPrimary;
            targetElement.classList.add(placementPrimary);
        }
        switch (placementPrimary) {
            case 'top':
                targetElPosition.top =
                    hostElPosition.top -
                        (targetElement.offsetHeight +
                            parseFloat(targetElStyles.marginBottom));
                targetElPosition.bottom +=
                    hostElPosition.top - targetElement.offsetHeight;
                targetElPosition.left = shiftWidth[placementSecondary];
                targetElPosition.right += shiftWidth[placementSecondary];
                break;
            case 'bottom':
                targetElPosition.top = shiftHeight[placementPrimary];
                targetElPosition.bottom += shiftHeight[placementPrimary];
                targetElPosition.left = shiftWidth[placementSecondary];
                targetElPosition.right += shiftWidth[placementSecondary];
                break;
            case 'left':
                targetElPosition.top = shiftHeight[placementSecondary];
                targetElPosition.bottom += shiftHeight[placementSecondary];
                targetElPosition.left =
                    hostElPosition.left -
                        (targetElement.offsetWidth + parseFloat(targetElStyles.marginRight));
                targetElPosition.right +=
                    hostElPosition.left - targetElement.offsetWidth;
                break;
            case 'right':
                targetElPosition.top = shiftHeight[placementSecondary];
                targetElPosition.bottom += shiftHeight[placementSecondary];
                targetElPosition.left = shiftWidth[placementPrimary];
                targetElPosition.right += shiftWidth[placementPrimary];
                break;
        }
        targetElPosition.top = Math.round(targetElPosition.top);
        targetElPosition.bottom = Math.round(targetElPosition.bottom);
        targetElPosition.left = Math.round(targetElPosition.left);
        targetElPosition.right = Math.round(targetElPosition.right);
        return targetElPosition;
    };
    Positioning.prototype.autoPosition = function (targetElPosition, hostElPosition, targetElement, preferredPosition) {
        if ((!preferredPosition || preferredPosition === 'right') &&
            targetElPosition.left + hostElPosition.left - targetElement.offsetWidth <
                0) {
            return 'right';
        }
        else if ((!preferredPosition || preferredPosition === 'top') &&
            targetElPosition.bottom +
                hostElPosition.bottom +
                targetElement.offsetHeight >
                window.innerHeight) {
            return 'top';
        }
        else if ((!preferredPosition || preferredPosition === 'bottom') &&
            targetElPosition.top + hostElPosition.top - targetElement.offsetHeight < 0) {
            return 'bottom';
        }
        else if ((!preferredPosition || preferredPosition === 'left') &&
            targetElPosition.right +
                hostElPosition.right +
                targetElement.offsetWidth >
                window.innerWidth) {
            return 'left';
        }
        return null;
    };
    Positioning.prototype.getAllStyles = function (element) {
        return window.getComputedStyle(element);
    };
    Positioning.prototype.getStyle = function (element, prop) {
        return this.getAllStyles(element)[prop];
    };
    Positioning.prototype.isStaticPositioned = function (element) {
        return (this.getStyle(element, 'position') || 'static') === 'static';
    };
    Positioning.prototype.offsetParent = function (element) {
        var offsetParentEl = element.offsetParent || document.documentElement;
        while (offsetParentEl &&
            offsetParentEl !== document.documentElement &&
            this.isStaticPositioned(offsetParentEl)) {
            offsetParentEl = offsetParentEl.offsetParent;
        }
        return offsetParentEl || document.documentElement;
    };
    return Positioning;
}());
var positionService = new Positioning();
function positionElements(hostElement, targetElement, placement, appendToBody) {
    var pos = positionService.positionElements(hostElement, targetElement, placement, appendToBody);
    targetElement.style.top = pos.top + "px";
    targetElement.style.left = pos.left + "px";
}

var PositioningService = (function () {
    function PositioningService() {
    }
    PositioningService.prototype.position = function (options) {
        var element = options.element, target = options.target, attachment = options.attachment, appendToBody = options.appendToBody;
        positionElements(_getHtmlElement(target), _getHtmlElement(element), attachment, appendToBody);
    };
    PositioningService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    PositioningService.ctorParameters = function () { return []; };
    return PositioningService;
}());
function _getHtmlElement(element) {
    // it means that we got a selector
    if (typeof element === 'string') {
        return document.querySelector(element);
    }
    if (element instanceof ElementRef) {
        return element.nativeElement;
    }
    return element;
}

var ComponentLoaderFactory = (function () {
    function ComponentLoaderFactory(_componentFactoryResolver, _ngZone, _injector, _posService, _applicationRef) {
        this._componentFactoryResolver = _componentFactoryResolver;
        this._ngZone = _ngZone;
        this._injector = _injector;
        this._posService = _posService;
        this._applicationRef = _applicationRef;
    }
    /**
     *
     * @param _elementRef
     * @param _viewContainerRef
     * @param _renderer
     * @returns {ComponentLoader}
     */
    ComponentLoaderFactory.prototype.createLoader = function (_elementRef, _viewContainerRef, _renderer) {
        return new ComponentLoader(_viewContainerRef, _renderer, _elementRef, this._injector, this._componentFactoryResolver, this._ngZone, this._applicationRef, this._posService);
    };
    ComponentLoaderFactory.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ComponentLoaderFactory.ctorParameters = function () { return [
        { type: ComponentFactoryResolver, },
        { type: NgZone, },
        { type: Injector, },
        { type: PositioningService, },
        { type: ApplicationRef, },
    ]; };
    return ComponentLoaderFactory;
}());

var BsDaterangepickerComponent = (function () {
    function BsDaterangepickerComponent(_config, _elementRef, _renderer, _viewContainerRef, cis) {
        this._config = _config;
        /**
         * Placement of a daterangepicker. Accepts: "top", "bottom", "left", "right"
         */
        this.placement = 'bottom';
        /**
         * Specifies events that should trigger. Supports a space separated list of
         * event names.
         */
        this.triggers = 'click';
        /**
         * Close daterangepicker on outside click
         */
        this.outsideClick = true;
        /**
         * A selector specifying the element the daterangepicker should be appended
         * to. Currently only supports "body".
         */
        this.container = 'body';
        /**
         * Emits when daterangepicker value has been changed
         */
        this.bsValueChange = new EventEmitter();
        this._subs = [];
        this._datepicker = cis.createLoader(_elementRef, _viewContainerRef, _renderer);
        Object.assign(this, _config);
        this.onShown = this._datepicker.onShown;
        this.onHidden = this._datepicker.onHidden;
    }
    Object.defineProperty(BsDaterangepickerComponent.prototype, "isOpen", {
        /**
         * Returns whether or not the daterangepicker is currently being shown
         */
        get: function () {
            return this._datepicker.isShown;
        },
        set: function (value) {
            if (value) {
                this.show();
            }
            else {
                this.hide();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDaterangepickerComponent.prototype, "bsValue", {
        /**
         * Initial value of daterangepicker
         */
        set: function (value) {
            if (this._bsValue === value) {
                return;
            }
            this._bsValue = value;
            this.bsValueChange.emit(value);
        },
        enumerable: true,
        configurable: true
    });
    BsDaterangepickerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._datepicker.listen({
            outsideClick: this.outsideClick,
            triggers: this.triggers,
            show: function () { return _this.show(); }
        });
    };
    BsDaterangepickerComponent.prototype.ngOnChanges = function (changes) {
        if (!this._datepickerRef || !this._datepickerRef.instance) {
            return;
        }
        if (changes.minDate) {
            this._datepickerRef.instance.minDate = this.minDate;
        }
        if (changes.maxDate) {
            this._datepickerRef.instance.maxDate = this.maxDate;
        }
        if (changes.isDisabled) {
            this._datepickerRef.instance.isDisabled = this.isDisabled;
        }
    };
    /**
     * Opens an element’s datepicker. This is considered a “manual” triggering of
     * the datepicker.
     */
    BsDaterangepickerComponent.prototype.show = function () {
        var _this = this;
        if (this._datepicker.isShown) {
            return;
        }
        this._config = Object.assign({}, this._config, { displayMonths: 2 }, this.bsConfig, {
            value: this._bsValue,
            isDisabled: this.isDisabled,
            minDate: this.minDate || this._config.minDate,
            maxDate: this.maxDate || this._config.maxDate
        });
        this._datepickerRef = this._datepicker
            .provide({ provide: BsDatepickerConfig, useValue: this._config })
            .attach(BsDaterangepickerContainerComponent)
            .to(this.container)
            .position({ attachment: this.placement })
            .show({ placement: this.placement });
        // if date changes from external source (model -> view)
        this._subs.push(this.bsValueChange.subscribe(function (value) {
            _this._datepickerRef.instance.value = value;
        }));
        // if date changes from picker (view -> model)
        this._subs.push(this._datepickerRef.instance.valueChange
            .filter(function (range) { return range && range[0] && !!range[1]; })
            .subscribe(function (value) {
            _this.bsValue = value;
            _this.hide();
        }));
    };
    /**
     * Closes an element’s datepicker. This is considered a “manual” triggering of
     * the datepicker.
     */
    BsDaterangepickerComponent.prototype.hide = function () {
        if (this.isOpen) {
            this._datepicker.hide();
        }
        for (var _i = 0, _a = this._subs; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
    };
    /**
     * Toggles an element’s datepicker. This is considered a “manual” triggering
     * of the datepicker.
     */
    BsDaterangepickerComponent.prototype.toggle = function () {
        if (this.isOpen) {
            return this.hide();
        }
        this.show();
    };
    BsDaterangepickerComponent.prototype.ngOnDestroy = function () {
        this._datepicker.dispose();
    };
    BsDaterangepickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-daterangepicker,[bsDaterangepicker]',
                    exportAs: 'bsDaterangepicker',
                    template: ' '
                },] },
    ];
    /** @nocollapse */
    BsDaterangepickerComponent.ctorParameters = function () { return [
        { type: BsDatepickerConfig, },
        { type: ElementRef, },
        { type: Renderer2, },
        { type: ViewContainerRef, },
        { type: ComponentLoaderFactory, },
    ]; };
    BsDaterangepickerComponent.propDecorators = {
        'placement': [{ type: Input },],
        'triggers': [{ type: Input },],
        'outsideClick': [{ type: Input },],
        'container': [{ type: Input },],
        'isOpen': [{ type: Input },],
        'onShown': [{ type: Output },],
        'onHidden': [{ type: Output },],
        'bsValue': [{ type: Input },],
        'bsConfig': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'minDate': [{ type: Input },],
        'maxDate': [{ type: Input },],
        'bsValueChange': [{ type: Output },],
    };
    return BsDaterangepickerComponent;
}());

var BsDatepickerComponent = (function () {
    function BsDatepickerComponent(_config, _elementRef, _renderer, _viewContainerRef, cis) {
        this._config = _config;
        /**
         * Placement of a datepicker. Accepts: "top", "bottom", "left", "right"
         */
        this.placement = 'bottom';
        /**
         * Specifies events that should trigger. Supports a space separated list of
         * event names.
         */
        this.triggers = 'click';
        /**
         * Close datepicker on outside click
         */
        this.outsideClick = true;
        /**
         * A selector specifying the element the datepicker should be appended to.
         * Currently only supports "body".
         */
        this.container = 'body';
        /**
         * Emits when datepicker value has been changed
         */
        this.bsValueChange = new EventEmitter();
        this._subs = [];
        // todo: assign only subset of fields
        Object.assign(this, this._config);
        this._datepicker = cis.createLoader(_elementRef, _viewContainerRef, _renderer);
        this.onShown = this._datepicker.onShown;
        this.onHidden = this._datepicker.onHidden;
    }
    Object.defineProperty(BsDatepickerComponent.prototype, "isOpen", {
        /**
         * Returns whether or not the datepicker is currently being shown
         */
        get: function () {
            return this._datepicker.isShown;
        },
        set: function (value) {
            if (value) {
                this.show();
            }
            else {
                this.hide();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDatepickerComponent.prototype, "bsValue", {
        /**
         * Initial value of datepicker
         */
        set: function (value) {
            if (this._bsValue === value) {
                return;
            }
            this._bsValue = value;
            this.bsValueChange.emit(value);
        },
        enumerable: true,
        configurable: true
    });
    BsDatepickerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._datepicker.listen({
            outsideClick: this.outsideClick,
            triggers: this.triggers,
            show: function () { return _this.show(); }
        });
    };
    BsDatepickerComponent.prototype.ngOnChanges = function (changes) {
        if (!this._datepickerRef || !this._datepickerRef.instance) {
            return;
        }
        if (changes.minDate) {
            this._datepickerRef.instance.minDate = this.minDate;
        }
        if (changes.maxDate) {
            this._datepickerRef.instance.maxDate = this.maxDate;
        }
        if (changes.isDisabled) {
            this._datepickerRef.instance.isDisabled = this.isDisabled;
        }
    };
    /**
     * Opens an element’s datepicker. This is considered a “manual” triggering of
     * the datepicker.
     */
    BsDatepickerComponent.prototype.show = function () {
        var _this = this;
        if (this._datepicker.isShown) {
            return;
        }
        this._config = Object.assign({}, this._config, this.bsConfig, {
            value: this._bsValue,
            isDisabled: this.isDisabled,
            minDate: this.minDate || this._config.minDate,
            maxDate: this.maxDate || this._config.maxDate
        });
        this._datepickerRef = this._datepicker
            .provide({ provide: BsDatepickerConfig, useValue: this._config })
            .attach(BsDatepickerContainerComponent)
            .to(this.container)
            .position({ attachment: this.placement })
            .show({ placement: this.placement });
        // if date changes from external source (model -> view)
        this._subs.push(this.bsValueChange.subscribe(function (value) {
            _this._datepickerRef.instance.value = value;
        }));
        // if date changes from picker (view -> model)
        this._subs.push(this._datepickerRef.instance.valueChange.subscribe(function (value) {
            _this.bsValue = value;
            _this.hide();
        }));
    };
    /**
     * Closes an element’s datepicker. This is considered a “manual” triggering of
     * the datepicker.
     */
    BsDatepickerComponent.prototype.hide = function () {
        if (this.isOpen) {
            this._datepicker.hide();
        }
        for (var _i = 0, _a = this._subs; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
    };
    /**
     * Toggles an element’s datepicker. This is considered a “manual” triggering
     * of the datepicker.
     */
    BsDatepickerComponent.prototype.toggle = function () {
        if (this.isOpen) {
            return this.hide();
        }
        this.show();
    };
    BsDatepickerComponent.prototype.ngOnDestroy = function () {
        this._datepicker.dispose();
    };
    BsDatepickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-datepicker,[bsDatepicker]',
                    exportAs: 'bsDatepicker',
                    template: '<ng-content></ng-content>'
                },] },
    ];
    /** @nocollapse */
    BsDatepickerComponent.ctorParameters = function () { return [
        { type: BsDatepickerConfig, },
        { type: ElementRef, },
        { type: Renderer2, },
        { type: ViewContainerRef, },
        { type: ComponentLoaderFactory, },
    ]; };
    BsDatepickerComponent.propDecorators = {
        'placement': [{ type: Input },],
        'triggers': [{ type: Input },],
        'outsideClick': [{ type: Input },],
        'container': [{ type: Input },],
        'isOpen': [{ type: Input },],
        'onShown': [{ type: Output },],
        'onHidden': [{ type: Output },],
        'bsValue': [{ type: Input },],
        'bsConfig': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'minDate': [{ type: Input },],
        'maxDate': [{ type: Input },],
        'bsValueChange': [{ type: Output },],
    };
    return BsDatepickerComponent;
}());

var BsDatepickerDayDecoratorComponent = (function () {
    function BsDatepickerDayDecoratorComponent() {
    }
    BsDatepickerDayDecoratorComponent.decorators = [
        { type: Component, args: [{
                    selector: '[bsDatepickerDayDecorator]',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        '[class.disabled]': 'day.isDisabled',
                        '[class.is-highlighted]': 'day.isHovered',
                        '[class.is-other-month]': 'day.isOtherMonth',
                        '[class.in-range]': 'day.isInRange',
                        '[class.select-start]': 'day.isSelectionStart',
                        '[class.select-end]': 'day.isSelectionEnd',
                        '[class.selected]': 'day.isSelected'
                    },
                    template: "{{ day.label }}"
                },] },
    ];
    /** @nocollapse */
    BsDatepickerDayDecoratorComponent.ctorParameters = function () { return []; };
    BsDatepickerDayDecoratorComponent.propDecorators = {
        'day': [{ type: Input },],
    };
    return BsDatepickerDayDecoratorComponent;
}());

var BsMonthCalendarViewComponent = (function () {
    function BsMonthCalendarViewComponent() {
        this.onNavigate = new EventEmitter();
        this.onViewMode = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.onHover = new EventEmitter();
    }
    BsMonthCalendarViewComponent.prototype.navigateTo = function (event) {
        var step = BsNavigationDirection.DOWN === event ? -1 : 1;
        this.onNavigate.emit({ step: { year: step } });
    };
    BsMonthCalendarViewComponent.prototype.viewMonth = function (month) {
        this.onSelect.emit(month);
    };
    BsMonthCalendarViewComponent.prototype.hoverMonth = function (cell, isHovered) {
        this.onHover.emit({ cell: cell, isHovered: isHovered });
    };
    BsMonthCalendarViewComponent.prototype.changeViewMode = function (event) {
        this.onViewMode.emit(event);
    };
    BsMonthCalendarViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-month-calendar-view',
                    template: "\n    <bs-calendar-layout>\n      <bs-datepicker-navigation-view\n        [calendar]=\"calendar\"\n        (onNavigate)=\"navigateTo($event)\"\n        (onViewMode)=\"changeViewMode($event)\"\n      ></bs-datepicker-navigation-view>\n\n      <table role=\"grid\" class=\"months\">\n        <tbody>\n        <tr *ngFor=\"let row of calendar.months\">\n          <td *ngFor=\"let month of row\" role=\"gridcell\"\n              (click)=\"viewMonth(month)\"\n              (mouseenter)=\"hoverMonth(month, true)\"\n              (mouseleave)=\"hoverMonth(month, false)\"\n              [class.disabled]=\"month.isDisabled\"\n              [class.is-highlighted]=\"month.isHovered\">\n            <span>{{ month.label }}</span>\n          </td>\n        </tr>\n        </tbody>\n      </table>\n    </bs-calendar-layout>\n  "
                },] },
    ];
    /** @nocollapse */
    BsMonthCalendarViewComponent.ctorParameters = function () { return []; };
    BsMonthCalendarViewComponent.propDecorators = {
        'calendar': [{ type: Input },],
        'onNavigate': [{ type: Output },],
        'onViewMode': [{ type: Output },],
        'onSelect': [{ type: Output },],
        'onHover': [{ type: Output },],
    };
    return BsMonthCalendarViewComponent;
}());

var BsYearsCalendarViewComponent = (function () {
    function BsYearsCalendarViewComponent() {
        this.onNavigate = new EventEmitter();
        this.onViewMode = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.onHover = new EventEmitter();
    }
    BsYearsCalendarViewComponent.prototype.navigateTo = function (event) {
        var step = BsNavigationDirection.DOWN === event ? -1 : 1;
        this.onNavigate.emit({ step: { year: step * yearsPerCalendar } });
    };
    BsYearsCalendarViewComponent.prototype.viewYear = function (year) {
        this.onSelect.emit(year);
    };
    BsYearsCalendarViewComponent.prototype.hoverYear = function (cell, isHovered) {
        this.onHover.emit({ cell: cell, isHovered: isHovered });
    };
    BsYearsCalendarViewComponent.prototype.changeViewMode = function (event) {
        this.onViewMode.emit(event);
    };
    BsYearsCalendarViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-years-calendar-view',
                    template: "\n    <bs-calendar-layout>\n      <bs-datepicker-navigation-view\n        [calendar]=\"calendar\"\n        (onNavigate)=\"navigateTo($event)\"\n        (onViewMode)=\"changeViewMode($event)\"\n      ></bs-datepicker-navigation-view>\n\n      <table role=\"grid\" class=\"years\">\n        <tbody>\n        <tr *ngFor=\"let row of calendar.years\">\n          <td *ngFor=\"let year of row\" role=\"gridcell\"\n              (click)=\"viewYear(year)\"\n              (mouseenter)=\"hoverYear(year, true)\"\n              (mouseleave)=\"hoverYear(year, false)\"\n              [class.disabled]=\"year.isDisabled\"\n              [class.is-highlighted]=\"year.isHovered\">\n            <span>{{ year.label }}</span>\n          </td>\n        </tr>\n        </tbody>\n      </table>\n    </bs-calendar-layout>\n  "
                },] },
    ];
    /** @nocollapse */
    BsYearsCalendarViewComponent.ctorParameters = function () { return []; };
    BsYearsCalendarViewComponent.propDecorators = {
        'calendar': [{ type: Input },],
        'onNavigate': [{ type: Output },],
        'onViewMode': [{ type: Output },],
        'onSelect': [{ type: Output },],
        'onHover': [{ type: Output },],
    };
    return BsYearsCalendarViewComponent;
}());

var BsCustomDatesViewComponent = (function () {
    function BsCustomDatesViewComponent() {
    }
    BsCustomDatesViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-custom-date-view',
                    template: "\n    <div class=\"bs-datepicker-predefined-btns\">\n      <button *ngFor=\"let range of ranges\">{{ range.label }}</button>\n      <button *ngIf=\"isCustomRangeShown\">Custom Range</button>\n    </div>\n  ",
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    BsCustomDatesViewComponent.ctorParameters = function () { return []; };
    BsCustomDatesViewComponent.propDecorators = {
        'isCustomRangeShown': [{ type: Input },],
        'ranges': [{ type: Input },],
    };
    return BsCustomDatesViewComponent;
}());

var BsCurrentDateViewComponent = (function () {
    function BsCurrentDateViewComponent() {
    }
    BsCurrentDateViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-current-date',
                    template: "<div class=\"current-timedate\"><span>{{ title }}</span></div>"
                },] },
    ];
    /** @nocollapse */
    BsCurrentDateViewComponent.ctorParameters = function () { return []; };
    BsCurrentDateViewComponent.propDecorators = {
        'title': [{ type: Input },],
    };
    return BsCurrentDateViewComponent;
}());

// tslint:disable:max-line-length
var BsTimepickerViewComponent = (function () {
    function BsTimepickerViewComponent() {
        this.ampm = 'ok';
        this.hours = 0;
        this.minutes = 0;
    }
    BsTimepickerViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-timepicker',
                    template: "\n    <div class=\"bs-timepicker-container\">\n      <div class=\"bs-timepicker-controls\">\n        <button class=\"bs-decrease\">-</button>\n        <input type=\"text\" [value]=\"hours\" placeholder=\"00\">\n        <button class=\"bs-increase\">+</button>\n      </div>\n      <div class=\"bs-timepicker-controls\">\n        <button class=\"bs-decrease\">-</button>\n        <input type=\"text\" [value]=\"minutes\" placeholder=\"00\">\n        <button class=\"bs-increase\">+</button>\n      </div>\n      <button class=\"switch-time-format\">{{ ampm }}\n        <img\n          src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAKCAYAAABi8KSDAAABSElEQVQYV3XQPUvDUBQG4HNuagtVqc6KgouCv6GIuIntYBLB9hcIQpLStCAIV7DYmpTcRWcXqZio3Vwc/UCc/QEqfgyKGbr0I7nS1EiHeqYzPO/h5SD0jaxUZjmSLCB+OFb+UFINFwASAEAdpu9gaGXVyAHHFQBkHpKHc6a9dzECvADyY9sqlAMsK9W0jzxDXqeytr3mhQckxSji27TJJ5/rPmIpwJJq3HrtduriYOurv1a4i1p5HnhkG9OFymi0ReoO05cGwb+ayv4dysVygjeFmsP05f8wpZQ8fsdvfmuY9zjWSNqUtgYFVnOVReILYoBFzdQI5/GGFzNHhGbeZnopDGU29sZbscgldmC99w35VOATTycIMMcBXIfpSVGzZhA6C8hh00conln6VQ9TGgV32OEAKQC4DrBq7CJwd0ggR7Vq/rPrfgB+C3sGypY5DAAAAABJRU5ErkJggg==\"\n          alt=\"\">\n      </button>\n    </div>\n  "
                },] },
    ];
    /** @nocollapse */
    BsTimepickerViewComponent.ctorParameters = function () { return []; };
    return BsTimepickerViewComponent;
}());

var BsCalendarLayoutComponent = (function () {
    function BsCalendarLayoutComponent() {
    }
    BsCalendarLayoutComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-calendar-layout',
                    template: "\n    <!-- current date, will be added in nearest releases -->\n    <bs-current-date title=\"hey there\" *ngIf=\"false\"></bs-current-date>\n\n    <!--navigation-->\n    <div class=\"bs-datepicker-head\">\n      <ng-content select=\"bs-datepicker-navigation-view\"></ng-content>\n    </div>\n\n    <div class=\"bs-datepicker-body\">\n      <ng-content></ng-content>\n    </div>\n\n    <!--timepicker-->\n    <bs-timepicker *ngIf=\"false\"></bs-timepicker>\n  "
                },] },
    ];
    /** @nocollapse */
    BsCalendarLayoutComponent.ctorParameters = function () { return []; };
    return BsCalendarLayoutComponent;
}());

var BS_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line
    useExisting: forwardRef(function () { return BsDatepickerInputDirective; }),
    multi: true
};
var BsDatepickerInputDirective = (function () {
    function BsDatepickerInputDirective(_picker, _renderer, _elRef, changeDetection) {
        var _this = this;
        this._picker = _picker;
        this._renderer = _renderer;
        this._elRef = _elRef;
        this.changeDetection = changeDetection;
        this._onChange = Function.prototype;
        this._onTouched = Function.prototype;
        this._picker.bsValueChange.subscribe(function (v) { return _this._setInputValue(v); });
    }
    BsDatepickerInputDirective.prototype._setInputValue = function (v) {
        var initialDate = formatDate(v, this._picker._config.dateInputFormat, this._picker._config.locale) || '';
        this._renderer.setProperty(this._elRef.nativeElement, 'value', initialDate);
        this._onChange(v);
        this.changeDetection.markForCheck();
    };
    BsDatepickerInputDirective.prototype.onChange = function (event) {
        this.writeValue(event.target.value);
        this._onTouched();
    };
    BsDatepickerInputDirective.prototype.writeValue = function (value) {
        if (!value) {
            this._picker.bsValue = null;
        }
        var _locale = getLocale(this._picker._config.locale);
        if (!_locale) {
            throw new Error("Locale \"" + this._picker._config
                .locale + "\" is not defined, please add it with \"defineLocale(...)\"");
        }
        if (typeof value === 'string') {
            var date = new Date(_locale.preparse(value));
            this._picker.bsValue = isNaN(date.valueOf()) ? null : date;
        }
        if (value instanceof Date) {
            this._picker.bsValue = value;
        }
    };
    BsDatepickerInputDirective.prototype.setDisabledState = function (isDisabled) {
        this._picker.isDisabled = isDisabled;
        if (isDisabled) {
            this._renderer.setAttribute(this._elRef.nativeElement, 'disabled', 'disabled');
            return;
        }
        this._renderer.removeAttribute(this._elRef.nativeElement, 'disabled');
    };
    BsDatepickerInputDirective.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    BsDatepickerInputDirective.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    BsDatepickerInputDirective.prototype.onBlur = function () {
        this._onTouched();
    };
    BsDatepickerInputDirective.prototype.hide = function () {
        this._picker.hide();
    };
    BsDatepickerInputDirective.decorators = [
        { type: Directive, args: [{
                    selector: "input[bsDatepicker]",
                    host: {
                        '(change)': 'onChange($event)',
                        '(keyup.esc)': 'hide()',
                        '(blur)': 'onBlur()'
                    },
                    providers: [BS_DATEPICKER_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    BsDatepickerInputDirective.ctorParameters = function () { return [
        { type: BsDatepickerComponent, decorators: [{ type: Host },] },
        { type: Renderer2, },
        { type: ElementRef, },
        { type: ChangeDetectorRef, },
    ]; };
    return BsDatepickerInputDirective;
}());

var BS_DATERANGEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line
    useExisting: forwardRef(function () { return BsDaterangepickerInputDirective; }),
    multi: true
};
var BsDaterangepickerInputDirective = (function () {
    function BsDaterangepickerInputDirective(_picker, _renderer, _elRef, changeDetection) {
        var _this = this;
        this._picker = _picker;
        this._renderer = _renderer;
        this._elRef = _elRef;
        this.changeDetection = changeDetection;
        this._onChange = Function.prototype;
        this._onTouched = Function.prototype;
        this._picker.bsValueChange.subscribe(function (v) { return _this._setInputValue(v); });
    }
    BsDaterangepickerInputDirective.prototype._setInputValue = function (date) {
        var range = '';
        if (date) {
            var start = formatDate(date[0], this._picker._config.rangeInputFormat, this._picker._config.locale) || '';
            var end = formatDate(date[1], this._picker._config.rangeInputFormat, this._picker._config.locale) || '';
            range = (start && end) ? start + this._picker._config.rangeSeparator + end : '';
        }
        this._renderer.setProperty(this._elRef.nativeElement, 'value', range);
        this._onChange(date);
        this.changeDetection.markForCheck();
    };
    BsDaterangepickerInputDirective.prototype.onChange = function (event) {
        this.writeValue(event.target.value);
        this._onTouched();
    };
    BsDaterangepickerInputDirective.prototype.writeValue = function (value) {
        if (!value) {
            this._picker.bsValue = null;
            return;
        }
        var _locale = getLocale(this._picker._config.locale);
        if (!_locale) {
            throw new Error("Locale \"" + this._picker._config
                .locale + "\" is not defined, please add it with \"defineLocale(...)\"");
        }
        if (typeof value === 'string') {
            this._picker.bsValue = value
                .split(this._picker._config.rangeSeparator)
                .map(function (date) { return new Date(_locale.preparse(date)); })
                .map(function (date) { return (isNaN(date.valueOf()) ? null : date); });
        }
        if (Array.isArray(value)) {
            this._picker.bsValue = value;
        }
    };
    BsDaterangepickerInputDirective.prototype.setDisabledState = function (isDisabled) {
        this._picker.isDisabled = isDisabled;
        if (isDisabled) {
            this._renderer.setAttribute(this._elRef.nativeElement, 'disabled', 'disabled');
            return;
        }
        this._renderer.removeAttribute(this._elRef.nativeElement, 'disabled');
    };
    BsDaterangepickerInputDirective.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    BsDaterangepickerInputDirective.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    BsDaterangepickerInputDirective.prototype.onBlur = function () {
        this._onTouched();
    };
    BsDaterangepickerInputDirective.prototype.hide = function () {
        this._picker.hide();
    };
    BsDaterangepickerInputDirective.decorators = [
        { type: Directive, args: [{
                    selector: "input[bsDaterangepicker]",
                    host: {
                        '(change)': 'onChange($event)',
                        '(keyup.esc)': 'hide()',
                        '(blur)': 'onBlur()'
                    },
                    providers: [BS_DATERANGEPICKER_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    BsDaterangepickerInputDirective.ctorParameters = function () { return [
        { type: BsDaterangepickerComponent, decorators: [{ type: Host },] },
        { type: Renderer2, },
        { type: ElementRef, },
        { type: ChangeDetectorRef, },
    ]; };
    return BsDaterangepickerInputDirective;
}());

var _messagesHash = {};
var _hideMsg = typeof console === 'undefined' || !('warn' in console);
function warnOnce(msg) {
    if (!isDevMode() || _hideMsg || msg in _messagesHash) {
        return;
    }
    _messagesHash[msg] = true;
    /*tslint:disable-next-line*/
    console.warn(msg);
}

var _exports = [
    BsDatepickerContainerComponent,
    BsDaterangepickerContainerComponent,
    BsDatepickerComponent,
    BsDatepickerInputDirective,
    BsDaterangepickerInputDirective,
    BsDaterangepickerComponent
];
var BsDatepickerModule = (function () {
    function BsDatepickerModule() {
        warnOnce("BsDatepickerModule is under development,\n      BREAKING CHANGES are possible,\n      PLEASE, read changelog");
    }
    BsDatepickerModule.forRoot = function () {
        return {
            ngModule: BsDatepickerModule,
            providers: [
                ComponentLoaderFactory,
                PositioningService,
                BsDatepickerStore,
                BsDatepickerActions,
                BsDatepickerConfig,
                BsDatepickerEffects
            ]
        };
    };
    BsDatepickerModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: [
                        BsDatepickerDayDecoratorComponent,
                        BsCurrentDateViewComponent,
                        BsDatepickerNavigationViewComponent,
                        BsTimepickerViewComponent,
                        BsCalendarLayoutComponent,
                        BsDaysCalendarViewComponent,
                        BsMonthCalendarViewComponent,
                        BsYearsCalendarViewComponent,
                        BsCustomDatesViewComponent
                    ].concat(_exports),
                    entryComponents: [
                        BsDatepickerContainerComponent,
                        BsDaterangepickerContainerComponent
                    ],
                    exports: _exports
                },] },
    ];
    /** @nocollapse */
    BsDatepickerModule.ctorParameters = function () { return []; };
    return BsDatepickerModule;
}());

var modalConfigDefaults = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: false,
    ignoreBackdropClick: false,
    class: '',
    animated: true
};
var CLASS_NAME = {
    SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
    BACKDROP: 'modal-backdrop',
    OPEN: 'modal-open',
    FADE: 'fade',
    IN: 'in',
    SHOW: 'show' // bs4
};


var DISMISS_REASONS = {
    BACKRDOP: 'backdrop-click',
    ESC: 'esc'
};

/** This component will be added as background layout for modals if enabled */
var ModalBackdropComponent = (function () {
    function ModalBackdropComponent(element, renderer) {
        this._isShown = false;
        this.element = element;
        this.renderer = renderer;
    }
    Object.defineProperty(ModalBackdropComponent.prototype, "isAnimated", {
        get: function () {
            return this._isAnimated;
        },
        set: function (value) {
            this._isAnimated = value;
            // this.renderer.setElementClass(this.element.nativeElement, `${ClassName.FADE}`, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModalBackdropComponent.prototype, "isShown", {
        get: function () {
            return this._isShown;
        },
        set: function (value) {
            this._isShown = value;
            if (value) {
                this.renderer.addClass(this.element.nativeElement, "" + CLASS_NAME.IN);
            }
            else {
                this.renderer.removeClass(this.element.nativeElement, "" + CLASS_NAME.IN);
            }
            if (!isBs3()) {
                if (value) {
                    this.renderer.addClass(this.element.nativeElement, "" + CLASS_NAME.SHOW);
                }
                else {
                    this.renderer.removeClass(this.element.nativeElement, "" + CLASS_NAME.SHOW);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    ModalBackdropComponent.prototype.ngOnInit = function () {
        if (this.isAnimated) {
            this.renderer.addClass(this.element.nativeElement, "" + CLASS_NAME.FADE);
            Utils.reflow(this.element.nativeElement);
        }
        this.isShown = true;
    };
    ModalBackdropComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-modal-backdrop',
                    template: ' ',
                    host: { class: CLASS_NAME.BACKDROP }
                },] },
    ];
    /** @nocollapse */
    ModalBackdropComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Renderer2, },
    ]; };
    return ModalBackdropComponent;
}());

/* tslint:disable:max-file-line-count */
// todo: should we support enforce focus in?
// todo: in original bs there are was a way to prevent modal from showing
// todo: original modal had resize events
var TRANSITION_DURATION = 300;
var BACKDROP_TRANSITION_DURATION = 150;
/** Mark any code with directive to show it's content in modal */
var ModalDirective = (function () {
    function ModalDirective(_element, _viewContainerRef, _renderer, clf) {
        this._element = _element;
        this._renderer = _renderer;
        /** This event fires immediately when the `show` instance method is called. */
        this.onShow = new EventEmitter();
        /** This event is fired when the modal has been made visible to the user
         * (will wait for CSS transitions to complete)
         */
        this.onShown = new EventEmitter();
        /** This event is fired immediately when
         * the hide instance method has been called.
         */
        this.onHide = new EventEmitter();
        /** This event is fired when the modal has finished being
         * hidden from the user (will wait for CSS transitions to complete).
         */
        this.onHidden = new EventEmitter();
        // seems like an Options
        this.isAnimated = true;
        this._isShown = false;
        this.isBodyOverflowing = false;
        this.originalBodyPadding = 0;
        this.scrollbarWidth = 0;
        this.timerHideModal = 0;
        this.timerRmBackDrop = 0;
        this.isNested = false;
        this._backdrop = clf.createLoader(_element, _viewContainerRef, _renderer);
    }
    Object.defineProperty(ModalDirective.prototype, "config", {
        get: function () {
            return this._config;
        },
        /** allows to set modal configuration via element property */
        set: function (conf) {
            this._config = this.getConfig(conf);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModalDirective.prototype, "isShown", {
        get: function () {
            return this._isShown;
        },
        enumerable: true,
        configurable: true
    });
    ModalDirective.prototype.onClick = function (event) {
        if (this.config.ignoreBackdropClick ||
            this.config.backdrop === 'static' ||
            event.target !== this._element.nativeElement) {
            return;
        }
        this.dismissReason = DISMISS_REASONS.BACKRDOP;
        this.hide(event);
    };
    // todo: consider preventing default and stopping propagation
    ModalDirective.prototype.onEsc = function () {
        if (this.config.keyboard) {
            this.dismissReason = DISMISS_REASONS.ESC;
            this.hide();
        }
    };
    ModalDirective.prototype.ngOnDestroy = function () {
        this.config = void 0;
        if (this._isShown) {
            this._isShown = false;
            this.hideModal();
            this._backdrop.dispose();
        }
    };
    ModalDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._config = this._config || this.getConfig();
        setTimeout(function () {
            if (_this._config.show) {
                _this.show();
            }
        }, 0);
    };
    /* Public methods */
    /** Allows to manually toggle modal visibility */
    ModalDirective.prototype.toggle = function () {
        return this._isShown ? this.hide() : this.show();
    };
    /** Allows to manually open modal */
    ModalDirective.prototype.show = function () {
        var _this = this;
        this.dismissReason = null;
        this.onShow.emit(this);
        if (this._isShown) {
            return;
        }
        clearTimeout(this.timerHideModal);
        clearTimeout(this.timerRmBackDrop);
        this._isShown = true;
        this.checkScrollbar();
        this.setScrollbar();
        if (document$1 && document$1.body) {
            if (document$1.body.classList.contains(CLASS_NAME.OPEN)) {
                this.isNested = true;
            }
            else {
                this._renderer.addClass(document$1.body, CLASS_NAME.OPEN);
            }
        }
        this.showBackdrop(function () {
            _this.showElement();
        });
    };
    /** Allows to manually close modal */
    ModalDirective.prototype.hide = function (event) {
        var _this = this;
        if (event) {
            event.preventDefault();
        }
        this.onHide.emit(this);
        // todo: add an option to prevent hiding
        if (!this._isShown) {
            return;
        }
        clearTimeout(this.timerHideModal);
        clearTimeout(this.timerRmBackDrop);
        this._isShown = false;
        this._renderer.removeClass(this._element.nativeElement, CLASS_NAME.IN);
        if (!isBs3()) {
            this._renderer.removeClass(this._element.nativeElement, CLASS_NAME.SHOW);
        }
        // this._addClassIn = false;
        if (this.isAnimated) {
            this.timerHideModal = setTimeout(function () { return _this.hideModal(); }, TRANSITION_DURATION);
        }
        else {
            this.hideModal();
        }
    };
    /** Private methods @internal */
    ModalDirective.prototype.getConfig = function (config) {
        return Object.assign({}, modalConfigDefaults, config);
    };
    /**
     *  Show dialog
     *  @internal
     */
    ModalDirective.prototype.showElement = function () {
        var _this = this;
        // todo: replace this with component loader usage
        if (!this._element.nativeElement.parentNode ||
            this._element.nativeElement.parentNode.nodeType !== Node.ELEMENT_NODE) {
            // don't move modals dom position
            if (document$1 && document$1.body) {
                document$1.body.appendChild(this._element.nativeElement);
            }
        }
        this._renderer.setAttribute(this._element.nativeElement, 'aria-hidden', 'false');
        this._renderer.setStyle(this._element.nativeElement, 'display', 'block');
        this._renderer.setProperty(this._element.nativeElement, 'scrollTop', 0);
        if (this.isAnimated) {
            Utils.reflow(this._element.nativeElement);
        }
        // this._addClassIn = true;
        this._renderer.addClass(this._element.nativeElement, CLASS_NAME.IN);
        if (!isBs3()) {
            this._renderer.addClass(this._element.nativeElement, CLASS_NAME.SHOW);
        }
        var transitionComplete = function () {
            if (_this._config.focus) {
                _this._element.nativeElement.focus();
            }
            _this.onShown.emit(_this);
        };
        if (this.isAnimated) {
            setTimeout(transitionComplete, TRANSITION_DURATION);
        }
        else {
            transitionComplete();
        }
    };
    /** @internal */
    ModalDirective.prototype.hideModal = function () {
        var _this = this;
        this._renderer.setAttribute(this._element.nativeElement, 'aria-hidden', 'true');
        this._renderer.setStyle(this._element.nativeElement, 'display', 'none');
        this.showBackdrop(function () {
            if (!_this.isNested) {
                if (document$1 && document$1.body) {
                    _this._renderer.removeClass(document$1.body, CLASS_NAME.OPEN);
                }
                _this.resetScrollbar();
            }
            _this.resetAdjustments();
            _this.focusOtherModal();
            _this.onHidden.emit(_this);
        });
    };
    // todo: original show was calling a callback when done, but we can use
    // promise
    /** @internal */
    ModalDirective.prototype.showBackdrop = function (callback) {
        var _this = this;
        if (this._isShown &&
            this.config.backdrop &&
            (!this.backdrop || !this.backdrop.instance.isShown)) {
            this.removeBackdrop();
            this._backdrop
                .attach(ModalBackdropComponent)
                .to('body')
                .show({ isAnimated: this.isAnimated });
            this.backdrop = this._backdrop._componentRef;
            if (!callback) {
                return;
            }
            if (!this.isAnimated) {
                callback();
                return;
            }
            setTimeout(callback, BACKDROP_TRANSITION_DURATION);
        }
        else if (!this._isShown && this.backdrop) {
            this.backdrop.instance.isShown = false;
            var callbackRemove = function () {
                _this.removeBackdrop();
                if (callback) {
                    callback();
                }
            };
            if (this.backdrop.instance.isAnimated) {
                this.timerRmBackDrop = setTimeout(callbackRemove, BACKDROP_TRANSITION_DURATION);
            }
            else {
                callbackRemove();
            }
        }
        else if (callback) {
            callback();
        }
    };
    /** @internal */
    ModalDirective.prototype.removeBackdrop = function () {
        this._backdrop.hide();
    };
    /** Events tricks */
    // no need for it
    // protected setEscapeEvent():void {
    //   if (this._isShown && this._config.keyboard) {
    //     $(this._element).on(Event.KEYDOWN_DISMISS, (event) => {
    //       if (event.which === 27) {
    //         this.hide()
    //       }
    //     })
    //
    //   } else if (!this._isShown) {
    //     $(this._element).off(Event.KEYDOWN_DISMISS)
    //   }
    // }
    // protected setResizeEvent():void {
    // console.log(this.renderer.listenGlobal('', Event.RESIZE));
    // if (this._isShown) {
    //   $(window).on(Event.RESIZE, $.proxy(this._handleUpdate, this))
    // } else {
    //   $(window).off(Event.RESIZE)
    // }
    // }
    ModalDirective.prototype.focusOtherModal = function () {
        if (this._element.nativeElement.parentElement == null)
            return;
        var otherOpenedModals = this._element.nativeElement.parentElement.querySelectorAll('.in[bsModal]');
        if (!otherOpenedModals.length) {
            return;
        }
        otherOpenedModals[otherOpenedModals.length - 1].focus();
    };
    /** @internal */
    ModalDirective.prototype.resetAdjustments = function () {
        this._renderer.setStyle(this._element.nativeElement, 'paddingLeft', '');
        this._renderer.setStyle(this._element.nativeElement, 'paddingRight', '');
    };
    /** Scroll bar tricks */
    /** @internal */
    ModalDirective.prototype.checkScrollbar = function () {
        this.isBodyOverflowing = document$1.body.clientWidth < win.innerWidth;
        this.scrollbarWidth = this.getScrollbarWidth();
    };
    ModalDirective.prototype.setScrollbar = function () {
        if (!document$1) {
            return;
        }
        this.originalBodyPadding = parseInt(win
            .getComputedStyle(document$1.body)
            .getPropertyValue('padding-right') || 0, 10);
        if (this.isBodyOverflowing) {
            document$1.body.style.paddingRight = this.originalBodyPadding +
                this.scrollbarWidth + "px";
        }
    };
    ModalDirective.prototype.resetScrollbar = function () {
        document$1.body.style.paddingRight = this.originalBodyPadding;
    };
    // thx d.walsh
    ModalDirective.prototype.getScrollbarWidth = function () {
        var scrollDiv = this._renderer.createElement('div');
        this._renderer.addClass(scrollDiv, CLASS_NAME.SCROLLBAR_MEASURER);
        this._renderer.appendChild(document$1.body, scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this._renderer.removeChild(document$1.body, scrollDiv);
        return scrollbarWidth;
    };
    ModalDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[bsModal]',
                    exportAs: 'bs-modal'
                },] },
    ];
    /** @nocollapse */
    ModalDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: ViewContainerRef, },
        { type: Renderer2, },
        { type: ComponentLoaderFactory, },
    ]; };
    ModalDirective.propDecorators = {
        'config': [{ type: Input },],
        'onShow': [{ type: Output },],
        'onShown': [{ type: Output },],
        'onHide': [{ type: Output },],
        'onHidden': [{ type: Output },],
        'onClick': [{ type: HostListener, args: ['click', ['$event'],] },],
        'onEsc': [{ type: HostListener, args: ['keydown.esc',] },],
    };
    return ModalDirective;
}());

/** Default dropdown configuration */
var BsDropdownConfig = (function () {
    function BsDropdownConfig() {
        /** default dropdown auto closing behavior */
        this.autoClose = true;
    }
    BsDropdownConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BsDropdownConfig.ctorParameters = function () { return []; };
    return BsDropdownConfig;
}());

var BsDropdownState = (function () {
    function BsDropdownState() {
        var _this = this;
        this.direction = 'down';
        this.isOpenChange = new EventEmitter();
        this.isDisabledChange = new EventEmitter();
        this.toggleClick = new EventEmitter();
        this.dropdownMenu = new Promise(function (resolve) {
            _this.resolveDropdownMenu = resolve;
        });
    }
    BsDropdownState.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    BsDropdownState.ctorParameters = function () { return []; };
    return BsDropdownState;
}());

var BsDropdownContainerComponent = (function () {
    function BsDropdownContainerComponent(_state, cd, _renderer, _element) {
        var _this = this;
        this._state = _state;
        this.cd = cd;
        this._renderer = _renderer;
        this.isOpen = false;
        this._subscription = _state.isOpenChange.subscribe(function (value) {
            _this.isOpen = value;
            var dropdown = _element.nativeElement.querySelector('.dropdown-menu');
            if (dropdown) {
                _this._renderer.addClass(dropdown, 'show');
                if (dropdown.classList.contains('dropdown-menu-right')) {
                    _this._renderer.setStyle(dropdown, 'left', 'auto');
                    _this._renderer.setStyle(dropdown, 'right', '0');
                }
                if (_this.direction === 'up') {
                    _this._renderer.setStyle(dropdown, 'top', 'auto');
                    _this._renderer.setStyle(dropdown, 'transform', 'translateY(-101%)');
                }
            }
            _this.cd.markForCheck();
            _this.cd.detectChanges();
        });
    }
    Object.defineProperty(BsDropdownContainerComponent.prototype, "direction", {
        get: function () {
            return this._state.direction;
        },
        enumerable: true,
        configurable: true
    });
    BsDropdownContainerComponent.prototype.ngOnDestroy = function () {
        this._subscription.unsubscribe();
    };
    BsDropdownContainerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-dropdown-container',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        style: 'display:block;position: absolute;'
                    },
                    template: "\n    <div [class.dropup]=\"direction === 'up'\"\n         [class.dropdown]=\"direction === 'down'\"\n         [class.show]=\"isOpen\"\n         [class.open]=\"isOpen\"><ng-content></ng-content></div>\n  "
                },] },
    ];
    /** @nocollapse */
    BsDropdownContainerComponent.ctorParameters = function () { return [
        { type: BsDropdownState, },
        { type: ChangeDetectorRef, },
        { type: Renderer2, },
        { type: ElementRef, },
    ]; };
    return BsDropdownContainerComponent;
}());

// tslint:disable:max-file-line-count
var BsDropdownDirective = (function () {
    function BsDropdownDirective(_elementRef, _renderer, _viewContainerRef, _cis, _config, _state) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._viewContainerRef = _viewContainerRef;
        this._cis = _cis;
        this._config = _config;
        this._state = _state;
        // todo: move to component loader
        this._isInlineOpen = false;
        this._subscriptions = [];
        this._isInited = false;
        // set initial dropdown state from config
        this._state.autoClose = this._config.autoClose;
        // create dropdown component loader
        this._dropdown = this._cis
            .createLoader(this._elementRef, this._viewContainerRef, this._renderer)
            .provide({ provide: BsDropdownState, useValue: this._state });
        this.onShown = this._dropdown.onShown;
        this.onHidden = this._dropdown.onHidden;
        this.isOpenChange = this._state.isOpenChange;
    }
    Object.defineProperty(BsDropdownDirective.prototype, "autoClose", {
        get: function () {
            return this._state.autoClose;
        },
        /**
         * Indicates that dropdown will be closed on item or document click,
         * and after pressing ESC
         */
        set: function (value) {
            this._state.autoClose = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDropdownDirective.prototype, "isDisabled", {
        get: function () {
            return this._isDisabled;
        },
        /**
         * Disables dropdown toggle and hides dropdown menu if opened
         */
        set: function (value) {
            this._isDisabled = value;
            this._state.isDisabledChange.emit(value);
            if (value) {
                this.hide();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDropdownDirective.prototype, "isOpen", {
        /**
         * Returns whether or not the popover is currently being shown
         */
        get: function () {
            if (this._showInline) {
                return this._isInlineOpen;
            }
            return this._dropdown.isShown;
        },
        set: function (value) {
            if (value) {
                this.show();
            }
            else {
                this.hide();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDropdownDirective.prototype, "isBs4", {
        get: function () {
            return !isBs3();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BsDropdownDirective.prototype, "_showInline", {
        get: function () {
            return !this.container;
        },
        enumerable: true,
        configurable: true
    });
    BsDropdownDirective.prototype.ngOnInit = function () {
        var _this = this;
        // fix: seems there are an issue with `routerLinkActive`
        // which result in duplicated call ngOnInit without call to ngOnDestroy
        // read more: https://github.com/valor-software/ngx-bootstrap/issues/1885
        if (this._isInited) {
            return;
        }
        this._isInited = true;
        // attach DOM listeners
        this._dropdown.listen({
            // because of dropdown inline mode
            outsideClick: false,
            triggers: this.triggers,
            show: function () { return _this.show(); }
        });
        // toggle visibility on toggle element click
        this._subscriptions.push(this._state.toggleClick.subscribe(function (value) { return _this.toggle(value); }));
        // hide dropdown if set disabled while opened
        this._subscriptions.push(this._state.isDisabledChange
            .filter(function (value) { return value; })
            .subscribe(function (value) { return _this.hide(); }));
    };
    /**
     * Opens an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    BsDropdownDirective.prototype.show = function () {
        var _this = this;
        if (this.isOpen || this.isDisabled) {
            return;
        }
        if (this._showInline) {
            if (!this._inlinedMenu) {
                this._state.dropdownMenu.then(function (dropdownMenu) {
                    _this._dropdown.attachInline(dropdownMenu.viewContainer, dropdownMenu.templateRef);
                    _this._inlinedMenu = _this._dropdown._inlineViewRef;
                    _this.addBs4Polyfills();
                })
                    .catch();
            }
            this.addBs4Polyfills();
            this._isInlineOpen = true;
            this.onShown.emit(true);
            this._state.isOpenChange.emit(true);
            return;
        }
        this._state.dropdownMenu.then(function (dropdownMenu) {
            // check direction in which dropdown should be opened
            var _dropup = _this.dropup ||
                (typeof _this.dropup !== 'undefined' && _this.dropup);
            _this._state.direction = _dropup ? 'up' : 'down';
            var _placement = _this.placement || (_dropup ? 'top left' : 'bottom left');
            // show dropdown
            _this._dropdown
                .attach(BsDropdownContainerComponent)
                .to(_this.container)
                .position({ attachment: _placement })
                .show({
                content: dropdownMenu.templateRef,
                placement: _placement
            });
            _this._state.isOpenChange.emit(true);
        })
            .catch();
    };
    /**
     * Closes an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    BsDropdownDirective.prototype.hide = function () {
        if (!this.isOpen) {
            return;
        }
        if (this._showInline) {
            this.removeShowClass();
            this._isInlineOpen = false;
            this.onHidden.emit(true);
        }
        else {
            this._dropdown.hide();
        }
        this._state.isOpenChange.emit(false);
    };
    /**
     * Toggles an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    BsDropdownDirective.prototype.toggle = function (value) {
        if (this.isOpen || !value) {
            return this.hide();
        }
        return this.show();
    };
    BsDropdownDirective.prototype.ngOnDestroy = function () {
        // clean up subscriptions and destroy dropdown
        for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
        this._dropdown.dispose();
    };
    BsDropdownDirective.prototype.addBs4Polyfills = function () {
        if (!isBs3()) {
            this.addShowClass();
            this.checkRightAlignment();
            this.checkDropup();
        }
    };
    BsDropdownDirective.prototype.addShowClass = function () {
        if (this._inlinedMenu && this._inlinedMenu.rootNodes[0]) {
            this._renderer.addClass(this._inlinedMenu.rootNodes[0], 'show');
        }
    };
    BsDropdownDirective.prototype.removeShowClass = function () {
        if (this._inlinedMenu && this._inlinedMenu.rootNodes[0]) {
            this._renderer.removeClass(this._inlinedMenu.rootNodes[0], 'show');
        }
    };
    BsDropdownDirective.prototype.checkRightAlignment = function () {
        if (this._inlinedMenu && this._inlinedMenu.rootNodes[0]) {
            var isRightAligned = this._inlinedMenu.rootNodes[0].classList.contains('dropdown-menu-right');
            this._renderer.setStyle(this._inlinedMenu.rootNodes[0], 'left', isRightAligned ? 'auto' : '0');
            this._renderer.setStyle(this._inlinedMenu.rootNodes[0], 'right', isRightAligned ? '0' : 'auto');
        }
    };
    BsDropdownDirective.prototype.checkDropup = function () {
        if (this._inlinedMenu && this._inlinedMenu.rootNodes[0]) {
            // a little hack to not break support of bootstrap 4 beta
            var top_1 = getComputedStyle(this._inlinedMenu.rootNodes[0]).top;
            var topAuto = top_1 === 'auto' || top_1 === '100%';
            this._renderer.setStyle(this._inlinedMenu.rootNodes[0], 'top', this.dropup ? 'auto' : '100%');
            this._renderer.setStyle(this._inlinedMenu.rootNodes[0], 'transform', this.dropup && !topAuto ? 'translateY(-101%)' : 'translateY(0)');
        }
    };
    BsDropdownDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[bsDropdown],[dropdown]',
                    exportAs: 'bs-dropdown',
                    providers: [BsDropdownState],
                    host: {
                        '[class.dropup]': 'dropup',
                        '[class.open]': 'isOpen',
                        '[class.show]': 'isOpen && isBs4'
                    }
                },] },
    ];
    /** @nocollapse */
    BsDropdownDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Renderer2, },
        { type: ViewContainerRef, },
        { type: ComponentLoaderFactory, },
        { type: BsDropdownConfig, },
        { type: BsDropdownState, },
    ]; };
    BsDropdownDirective.propDecorators = {
        'placement': [{ type: Input },],
        'triggers': [{ type: Input },],
        'container': [{ type: Input },],
        'dropup': [{ type: Input },],
        'autoClose': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'isOpen': [{ type: Input },],
        'isOpenChange': [{ type: Output },],
        'onShown': [{ type: Output },],
        'onHidden': [{ type: Output },],
    };
    return BsDropdownDirective;
}());

var BsDropdownMenuDirective = (function () {
    function BsDropdownMenuDirective(_state, _viewContainer, _templateRef) {
        _state.resolveDropdownMenu({
            templateRef: _templateRef,
            viewContainer: _viewContainer
        });
    }
    BsDropdownMenuDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[bsDropdownMenu],[dropdownMenu]',
                    exportAs: 'bs-dropdown-menu'
                },] },
    ];
    /** @nocollapse */
    BsDropdownMenuDirective.ctorParameters = function () { return [
        { type: BsDropdownState, },
        { type: ViewContainerRef, },
        { type: TemplateRef, },
    ]; };
    return BsDropdownMenuDirective;
}());

var BsDropdownToggleDirective = (function () {
    function BsDropdownToggleDirective(_state, _element) {
        var _this = this;
        this._state = _state;
        this._element = _element;
        this.isDisabled = null;
        this._subscriptions = [];
        // sync is open value with state
        this._subscriptions.push(this._state.isOpenChange.subscribe(function (value) { return (_this.isOpen = value); }));
        // populate disabled state
        this._subscriptions.push(this._state.isDisabledChange.subscribe(function (value) { return (_this.isDisabled = value || null); }));
    }
    BsDropdownToggleDirective.prototype.onClick = function () {
        if (this.isDisabled) {
            return;
        }
        this._state.toggleClick.emit(true);
    };
    BsDropdownToggleDirective.prototype.onDocumentClick = function (event) {
        if (this._state.autoClose &&
            event.button !== 2 &&
            !this._element.nativeElement.contains(event.target)) {
            this._state.toggleClick.emit(false);
        }
    };
    BsDropdownToggleDirective.prototype.onEsc = function () {
        if (this._state.autoClose) {
            this._state.toggleClick.emit(false);
        }
    };
    BsDropdownToggleDirective.prototype.ngOnDestroy = function () {
        for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
    };
    BsDropdownToggleDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[bsDropdownToggle],[dropdownToggle]',
                    exportAs: 'bs-dropdown-toggle',
                    host: {
                        '[attr.aria-haspopup]': 'true'
                    }
                },] },
    ];
    /** @nocollapse */
    BsDropdownToggleDirective.ctorParameters = function () { return [
        { type: BsDropdownState, },
        { type: ElementRef, },
    ]; };
    BsDropdownToggleDirective.propDecorators = {
        'isDisabled': [{ type: HostBinding, args: ['attr.disabled',] },],
        'isOpen': [{ type: HostBinding, args: ['attr.aria-expanded',] },],
        'onClick': [{ type: HostListener, args: ['click', [],] },],
        'onDocumentClick': [{ type: HostListener, args: ['document:click', ['$event'],] },],
        'onEsc': [{ type: HostListener, args: ['keyup.esc',] },],
    };
    return BsDropdownToggleDirective;
}());

var BsDropdownModule = (function () {
    function BsDropdownModule() {
    }
    BsDropdownModule.forRoot = function (config) {
        return {
            ngModule: BsDropdownModule,
            providers: [
                ComponentLoaderFactory,
                PositioningService,
                BsDropdownState,
                {
                    provide: BsDropdownConfig,
                    useValue: config ? config : { autoClose: true }
                }
            ]
        };
    };
    BsDropdownModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        BsDropdownMenuDirective,
                        BsDropdownToggleDirective,
                        BsDropdownContainerComponent,
                        BsDropdownDirective
                    ],
                    exports: [
                        BsDropdownMenuDirective,
                        BsDropdownToggleDirective,
                        BsDropdownDirective
                    ],
                    entryComponents: [BsDropdownContainerComponent]
                },] },
    ];
    /** @nocollapse */
    BsDropdownModule.ctorParameters = function () { return []; };
    return BsDropdownModule;
}());

// todo: split
/** Provides default values for Pagination and pager components */
var PaginationConfig = (function () {
    function PaginationConfig() {
        this.main = {
            maxSize: void 0,
            itemsPerPage: 10,
            boundaryLinks: false,
            directionLinks: true,
            firstText: 'First',
            previousText: 'Previous',
            nextText: 'Next',
            lastText: 'Last',
            pageBtnClass: '',
            rotate: true
        };
        this.pager = {
            itemsPerPage: 15,
            previousText: '« Previous',
            nextText: 'Next »',
            pageBtnClass: '',
            align: true
        };
    }
    PaginationConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    PaginationConfig.ctorParameters = function () { return []; };
    return PaginationConfig;
}());

var PAGER_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line
    useExisting: forwardRef(function () { return PagerComponent; }),
    multi: true
};
var PagerComponent = (function () {
    function PagerComponent(renderer, elementRef, paginationConfig, changeDetection) {
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.changeDetection = changeDetection;
        /** fired when total pages count changes, $event:number equals to total pages count */
        this.numPages = new EventEmitter();
        /** fired when page was changed, $event:{page, itemsPerPage} equals to
         * object with current page index and number of items per page
         */
        this.pageChanged = new EventEmitter();
        this.onChange = Function.prototype;
        this.onTouched = Function.prototype;
        this.inited = false;
        this._page = 1;
        this.renderer = renderer;
        this.elementRef = elementRef;
        if (!this.config) {
            this.configureOptions(Object.assign({}, paginationConfig.main, paginationConfig.pager));
        }
    }
    Object.defineProperty(PagerComponent.prototype, "itemsPerPage", {
        /** maximum number of items per page. If value less than 1 will display all items on one page */
        get: function () {
            return this._itemsPerPage;
        },
        set: function (v) {
            this._itemsPerPage = v;
            this.totalPages = this.calculateTotalPages();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagerComponent.prototype, "totalItems", {
        /** total number of items in all pages */
        get: function () {
            return this._totalItems;
        },
        set: function (v) {
            this._totalItems = v;
            this.totalPages = this.calculateTotalPages();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagerComponent.prototype, "totalPages", {
        get: function () {
            return this._totalPages;
        },
        set: function (v) {
            this._totalPages = v;
            this.numPages.emit(v);
            if (this.inited) {
                this.selectPage(this.page);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagerComponent.prototype, "page", {
        get: function () {
            return this._page;
        },
        set: function (value) {
            var _previous = this._page;
            this._page = value > this.totalPages ? this.totalPages : value || 1;
            this.changeDetection.markForCheck();
            if (_previous === this._page || typeof _previous === 'undefined') {
                return;
            }
            this.pageChanged.emit({
                page: this._page,
                itemsPerPage: this.itemsPerPage
            });
        },
        enumerable: true,
        configurable: true
    });
    PagerComponent.prototype.configureOptions = function (config) {
        this.config = Object.assign({}, config);
    };
    PagerComponent.prototype.ngOnInit = function () {
        if (typeof window !== 'undefined') {
            this.classMap = this.elementRef.nativeElement.getAttribute('class') || '';
        }
        // watch for maxSize
        this.maxSize =
            typeof this.maxSize !== 'undefined' ? this.maxSize : this.config.maxSize;
        this.rotate =
            typeof this.rotate !== 'undefined' ? this.rotate : this.config.rotate;
        this.boundaryLinks =
            typeof this.boundaryLinks !== 'undefined'
                ? this.boundaryLinks
                : this.config.boundaryLinks;
        this.directionLinks =
            typeof this.directionLinks !== 'undefined'
                ? this.directionLinks
                : this.config.directionLinks;
        this.pageBtnClass =
            typeof this.pageBtnClass !== 'undefined'
                ? this.pageBtnClass
                : this.config.pageBtnClass;
        // base class
        this.itemsPerPage =
            typeof this.itemsPerPage !== 'undefined'
                ? this.itemsPerPage
                : this.config.itemsPerPage;
        this.totalPages = this.calculateTotalPages();
        // this class
        this.pages = this.getPages(this.page, this.totalPages);
        this.inited = true;
    };
    PagerComponent.prototype.writeValue = function (value) {
        this.page = value;
        this.pages = this.getPages(this.page, this.totalPages);
    };
    PagerComponent.prototype.getText = function (key) {
        return this[key + "Text"] || this.config[key + "Text"];
    };
    PagerComponent.prototype.noPrevious = function () {
        return this.page === 1;
    };
    PagerComponent.prototype.noNext = function () {
        return this.page === this.totalPages;
    };
    PagerComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    PagerComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    PagerComponent.prototype.selectPage = function (page, event) {
        if (event) {
            event.preventDefault();
        }
        if (!this.disabled) {
            if (event && event.target) {
                var target = event.target;
                target.blur();
            }
            this.writeValue(page);
            this.onChange(this.page);
        }
    };
    // Create page object used in template
    PagerComponent.prototype.makePage = function (num, text, active) {
        return { text: text, number: num, active: active };
    };
    PagerComponent.prototype.getPages = function (currentPage, totalPages) {
        var pages = [];
        // Default page limits
        var startPage = 1;
        var endPage = totalPages;
        var isMaxSized = typeof this.maxSize !== 'undefined' && this.maxSize < totalPages;
        // recompute if maxSize
        if (isMaxSized) {
            if (this.rotate) {
                // Current page is displayed in the middle of the visible ones
                startPage = Math.max(currentPage - Math.floor(this.maxSize / 2), 1);
                endPage = startPage + this.maxSize - 1;
                // Adjust if limit is exceeded
                if (endPage > totalPages) {
                    endPage = totalPages;
                    startPage = endPage - this.maxSize + 1;
                }
            }
            else {
                // Visible pages are paginated with maxSize
                startPage =
                    (Math.ceil(currentPage / this.maxSize) - 1) * this.maxSize + 1;
                // Adjust last page if limit is exceeded
                endPage = Math.min(startPage + this.maxSize - 1, totalPages);
            }
        }
        // Add page number links
        for (var num = startPage; num <= endPage; num++) {
            var page = this.makePage(num, num.toString(), num === currentPage);
            pages.push(page);
        }
        // Add links to move between page sets
        if (isMaxSized && !this.rotate) {
            if (startPage > 1) {
                var previousPageSet = this.makePage(startPage - 1, '...', false);
                pages.unshift(previousPageSet);
            }
            if (endPage < totalPages) {
                var nextPageSet = this.makePage(endPage + 1, '...', false);
                pages.push(nextPageSet);
            }
        }
        return pages;
    };
    // base class
    PagerComponent.prototype.calculateTotalPages = function () {
        var totalPages = this.itemsPerPage < 1
            ? 1
            : Math.ceil(this.totalItems / this.itemsPerPage);
        return Math.max(totalPages || 0, 1);
    };
    PagerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pager',
                    template: "<ul class=\"pager\"> <li [class.disabled]=\"noPrevious()\" [class.previous]=\"align\" [ngClass]=\"{'pull-right': align, 'float-right': align}\" class=\"{{ pageBtnClass }}\"> <a href (click)=\"selectPage(page - 1, $event)\">{{ getText('previous') }}</a> </li> <li [class.disabled]=\"noNext()\" [class.next]=\"align\" [ngClass]=\"{'pull-right': align, 'float-right': align}\" class=\"{{ pageBtnClass }}\"> <a href (click)=\"selectPage(page + 1, $event)\">{{ getText('next') }}</a> </li> </ul> ",
                    providers: [PAGER_CONTROL_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    PagerComponent.ctorParameters = function () { return [
        { type: Renderer2, },
        { type: ElementRef, },
        { type: PaginationConfig, },
        { type: ChangeDetectorRef, },
    ]; };
    PagerComponent.propDecorators = {
        'align': [{ type: Input },],
        'maxSize': [{ type: Input },],
        'boundaryLinks': [{ type: Input },],
        'directionLinks': [{ type: Input },],
        'firstText': [{ type: Input },],
        'previousText': [{ type: Input },],
        'nextText': [{ type: Input },],
        'lastText': [{ type: Input },],
        'rotate': [{ type: Input },],
        'pageBtnClass': [{ type: Input },],
        'disabled': [{ type: Input },],
        'numPages': [{ type: Output },],
        'pageChanged': [{ type: Output },],
        'itemsPerPage': [{ type: Input },],
        'totalItems': [{ type: Input },],
    };
    return PagerComponent;
}());

var PAGINATION_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line
    useExisting: forwardRef(function () { return PaginationComponent; }),
    multi: true
};
var PaginationComponent = (function () {
    function PaginationComponent(renderer, elementRef, paginationConfig, changeDetection) {
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.changeDetection = changeDetection;
        /** fired when total pages count changes, $event:number equals to total pages count */
        this.numPages = new EventEmitter();
        /** fired when page was changed, $event:{page, itemsPerPage} equals to object
         * with current page index and number of items per page
         */
        this.pageChanged = new EventEmitter();
        this.onChange = Function.prototype;
        this.onTouched = Function.prototype;
        this.inited = false;
        this._page = 1;
        this.renderer = renderer;
        this.elementRef = elementRef;
        if (!this.config) {
            this.configureOptions(paginationConfig.main);
        }
    }
    Object.defineProperty(PaginationComponent.prototype, "itemsPerPage", {
        /** maximum number of items per page. If value less than 1 will display all items on one page */
        get: function () {
            return this._itemsPerPage;
        },
        set: function (v) {
            this._itemsPerPage = v;
            this.totalPages = this.calculateTotalPages();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginationComponent.prototype, "totalItems", {
        /** total number of items in all pages */
        get: function () {
            return this._totalItems;
        },
        set: function (v) {
            this._totalItems = v;
            this.totalPages = this.calculateTotalPages();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginationComponent.prototype, "totalPages", {
        get: function () {
            return this._totalPages;
        },
        set: function (v) {
            this._totalPages = v;
            this.numPages.emit(v);
            if (this.inited) {
                this.selectPage(this.page);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginationComponent.prototype, "page", {
        get: function () {
            return this._page;
        },
        set: function (value) {
            var _previous = this._page;
            this._page = value > this.totalPages ? this.totalPages : value || 1;
            this.changeDetection.markForCheck();
            if (_previous === this._page || typeof _previous === 'undefined') {
                return;
            }
            this.pageChanged.emit({
                page: this._page,
                itemsPerPage: this.itemsPerPage
            });
        },
        enumerable: true,
        configurable: true
    });
    PaginationComponent.prototype.configureOptions = function (config) {
        this.config = Object.assign({}, config);
    };
    PaginationComponent.prototype.ngOnInit = function () {
        if (typeof window !== 'undefined') {
            this.classMap = this.elementRef.nativeElement.getAttribute('class') || '';
        }
        // watch for maxSize
        this.maxSize =
            typeof this.maxSize !== 'undefined' ? this.maxSize : this.config.maxSize;
        this.rotate =
            typeof this.rotate !== 'undefined' ? this.rotate : this.config.rotate;
        this.boundaryLinks =
            typeof this.boundaryLinks !== 'undefined'
                ? this.boundaryLinks
                : this.config.boundaryLinks;
        this.directionLinks =
            typeof this.directionLinks !== 'undefined'
                ? this.directionLinks
                : this.config.directionLinks;
        this.pageBtnClass =
            typeof this.pageBtnClass !== 'undefined'
                ? this.pageBtnClass
                : this.config.pageBtnClass;
        // base class
        this.itemsPerPage =
            typeof this.itemsPerPage !== 'undefined'
                ? this.itemsPerPage
                : this.config.itemsPerPage;
        this.totalPages = this.calculateTotalPages();
        // this class
        this.pages = this.getPages(this.page, this.totalPages);
        this.inited = true;
    };
    PaginationComponent.prototype.writeValue = function (value) {
        this.page = value;
        this.pages = this.getPages(this.page, this.totalPages);
    };
    PaginationComponent.prototype.getText = function (key) {
        return this[key + "Text"] || this.config[key + "Text"];
    };
    PaginationComponent.prototype.noPrevious = function () {
        return this.page === 1;
    };
    PaginationComponent.prototype.noNext = function () {
        return this.page === this.totalPages;
    };
    PaginationComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    PaginationComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    PaginationComponent.prototype.selectPage = function (page, event) {
        if (event) {
            event.preventDefault();
        }
        if (!this.disabled) {
            if (event && event.target) {
                var target = event.target;
                target.blur();
            }
            this.writeValue(page);
            this.onChange(this.page);
        }
    };
    // Create page object used in template
    PaginationComponent.prototype.makePage = function (num, text, active) {
        return { text: text, number: num, active: active };
    };
    PaginationComponent.prototype.getPages = function (currentPage, totalPages) {
        var pages = [];
        // Default page limits
        var startPage = 1;
        var endPage = totalPages;
        var isMaxSized = typeof this.maxSize !== 'undefined' && this.maxSize < totalPages;
        // recompute if maxSize
        if (isMaxSized) {
            if (this.rotate) {
                // Current page is displayed in the middle of the visible ones
                startPage = Math.max(currentPage - Math.floor(this.maxSize / 2), 1);
                endPage = startPage + this.maxSize - 1;
                // Adjust if limit is exceeded
                if (endPage > totalPages) {
                    endPage = totalPages;
                    startPage = endPage - this.maxSize + 1;
                }
            }
            else {
                // Visible pages are paginated with maxSize
                startPage =
                    (Math.ceil(currentPage / this.maxSize) - 1) * this.maxSize + 1;
                // Adjust last page if limit is exceeded
                endPage = Math.min(startPage + this.maxSize - 1, totalPages);
            }
        }
        // Add page number links
        for (var num = startPage; num <= endPage; num++) {
            var page = this.makePage(num, num.toString(), num === currentPage);
            pages.push(page);
        }
        // Add links to move between page sets
        if (isMaxSized && !this.rotate) {
            if (startPage > 1) {
                var previousPageSet = this.makePage(startPage - 1, '...', false);
                pages.unshift(previousPageSet);
            }
            if (endPage < totalPages) {
                var nextPageSet = this.makePage(endPage + 1, '...', false);
                pages.push(nextPageSet);
            }
        }
        return pages;
    };
    // base class
    PaginationComponent.prototype.calculateTotalPages = function () {
        var totalPages = this.itemsPerPage < 1
            ? 1
            : Math.ceil(this.totalItems / this.itemsPerPage);
        return Math.max(totalPages || 0, 1);
    };
    PaginationComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pagination',
                    template: "<ul class=\"pagination\" [ngClass]=\"classMap\"> <li class=\"pagination-first page-item\" *ngIf=\"boundaryLinks\" [class.disabled]=\"noPrevious()||disabled\"> <a class=\"page-link\" href (click)=\"selectPage(1, $event)\" [innerHTML]=\"getText('first')\"></a> </li> <li class=\"pagination-prev page-item\" *ngIf=\"directionLinks\" [class.disabled]=\"noPrevious()||disabled\"> <a class=\"page-link\" href (click)=\"selectPage(page - 1, $event)\" [innerHTML]=\"getText('previous')\"></a> </li> <li *ngFor=\"let pg of pages\" [class.active]=\"pg.active\" [class.disabled]=\"disabled&&!pg.active\" class=\"pagination-page page-item\"> <a class=\"page-link\" href (click)=\"selectPage(pg.number, $event)\" [innerHTML]=\"pg.text\"></a> </li> <li class=\"pagination-next page-item\" *ngIf=\"directionLinks\" [class.disabled]=\"noNext()||disabled\"> <a class=\"page-link\" href (click)=\"selectPage(page + 1, $event)\" [innerHTML]=\"getText('next')\"></a></li> <li class=\"pagination-last page-item\" *ngIf=\"boundaryLinks\" [class.disabled]=\"noNext()||disabled\"> <a class=\"page-link\" href (click)=\"selectPage(totalPages, $event)\" [innerHTML]=\"getText('last')\"></a></li> </ul> ",
                    providers: [PAGINATION_CONTROL_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    PaginationComponent.ctorParameters = function () { return [
        { type: Renderer2, },
        { type: ElementRef, },
        { type: PaginationConfig, },
        { type: ChangeDetectorRef, },
    ]; };
    PaginationComponent.propDecorators = {
        'align': [{ type: Input },],
        'maxSize': [{ type: Input },],
        'boundaryLinks': [{ type: Input },],
        'directionLinks': [{ type: Input },],
        'firstText': [{ type: Input },],
        'previousText': [{ type: Input },],
        'nextText': [{ type: Input },],
        'lastText': [{ type: Input },],
        'rotate': [{ type: Input },],
        'pageBtnClass': [{ type: Input },],
        'disabled': [{ type: Input },],
        'numPages': [{ type: Output },],
        'pageChanged': [{ type: Output },],
        'itemsPerPage': [{ type: Input },],
        'totalItems': [{ type: Input },],
    };
    return PaginationComponent;
}());

// todo: progress element conflict with bootstrap.css
// todo: need hack: replace host element with div
var ProgressDirective = (function () {
    function ProgressDirective() {
        this.addClass = true;
        this.bars = [];
        this._max = 100;
    }
    Object.defineProperty(ProgressDirective.prototype, "max", {
        /** maximum total value of progress element */
        get: function () {
            return this._max;
        },
        set: function (v) {
            this._max = v;
            this.bars.forEach(function (bar) {
                bar.recalculatePercentage();
            });
        },
        enumerable: true,
        configurable: true
    });
    ProgressDirective.prototype.addBar = function (bar) {
        if (!this.animate) {
            bar.transition = 'none';
        }
        this.bars.push(bar);
    };
    ProgressDirective.prototype.removeBar = function (bar) {
        this.bars.splice(this.bars.indexOf(bar), 1);
    };
    ProgressDirective.decorators = [
        { type: Directive, args: [{ selector: 'bs-progress, [progress]' },] },
    ];
    /** @nocollapse */
    ProgressDirective.ctorParameters = function () { return []; };
    ProgressDirective.propDecorators = {
        'animate': [{ type: Input },],
        'max': [{ type: HostBinding, args: ['attr.max',] }, { type: Input },],
        'addClass': [{ type: HostBinding, args: ['class.progress',] },],
    };
    return ProgressDirective;
}());

// todo: number pipe
// todo: use query from progress?
var BarComponent = (function () {
    function BarComponent(progress) {
        this.percent = 0;
        this.progress = progress;
    }
    Object.defineProperty(BarComponent.prototype, "value", {
        /** current value of progress bar */
        get: function () {
            return this._value;
        },
        set: function (v) {
            if (!v && v !== 0) {
                return;
            }
            this._value = v;
            this.recalculatePercentage();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BarComponent.prototype, "setBarWidth", {
        get: function () {
            this.recalculatePercentage();
            return this.isBs3 ? '' : this.percent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BarComponent.prototype, "isBs3", {
        get: function () {
            return isBs3();
        },
        enumerable: true,
        configurable: true
    });
    BarComponent.prototype.ngOnInit = function () {
        this.progress.addBar(this);
    };
    BarComponent.prototype.ngOnDestroy = function () {
        this.progress.removeBar(this);
    };
    BarComponent.prototype.recalculatePercentage = function () {
        this.percent = +(this.value / this.progress.max * 100).toFixed(2);
        var totalPercentage = this.progress.bars
            .reduce(function (total, bar) {
            return total + bar.percent;
        }, 0);
        if (totalPercentage > 100) {
            this.percent -= totalPercentage - 100;
        }
    };
    BarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bar',
                    template: "<div class=\"progress-bar\" style=\"min-width: 0;\" role=\"progressbar\" [ngClass]=\"type && 'progress-bar-' + type + ' bg-' + type\" [ngStyle]=\"{width: (isBs3 ? (percent < 100 ? percent : 100) + '%' : '100%'), transition: transition}\" aria-valuemin=\"0\" [attr.aria-valuenow]=\"value\" [attr.aria-valuetext]=\"percent.toFixed(0) + '%'\" [attr.aria-valuemax]=\"max\"> <ng-content></ng-content> </div> "
                },] },
    ];
    /** @nocollapse */
    BarComponent.ctorParameters = function () { return [
        { type: ProgressDirective, decorators: [{ type: Host },] },
    ]; };
    BarComponent.propDecorators = {
        'type': [{ type: Input },],
        'value': [{ type: Input },],
        'setBarWidth': [{ type: HostBinding, args: ['style.width.%',] },],
    };
    return BarComponent;
}());

var ProgressbarConfig = (function () {
    function ProgressbarConfig() {
        /** if `true` changing value of progress bar will be animated (note: not supported by Bootstrap 4) */
        this.animate = true;
        /** maximum total value of progress element */
        this.max = 100;
    }
    ProgressbarConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ProgressbarConfig.ctorParameters = function () { return []; };
    return ProgressbarConfig;
}());

var ProgressbarComponent = (function () {
    function ProgressbarComponent(config) {
        this.isStacked = false;
        Object.assign(this, config);
    }
    Object.defineProperty(ProgressbarComponent.prototype, "value", {
        /** current value of progress bar. Could be a number or array of objects
         * like {"value":15,"type":"info","label":"15 %"}
         */
        set: function (value) {
            this.isStacked = Array.isArray(value);
            this._value = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressbarComponent.prototype, "isBs3", {
        get: function () {
            return isBs3();
        },
        enumerable: true,
        configurable: true
    });
    ProgressbarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'progressbar',
                    template: "<div progress [animate]=\"animate\" [max]=\"max\" [style.width]=\"!isBs3 ? '100%' : 'auto'\"> <bar [type]=\"type\" [value]=\"_value\" *ngIf=\"!isStacked\"> <ng-content></ng-content> </bar> <ng-template [ngIf]=\"isStacked\"> <bar *ngFor=\"let item of _value\" [type]=\"item.type\" [value]=\"item.value\">{{ item.label }} </bar> </ng-template> </div> ",
                    styles: [
                        "\n    :host {\n      width: 100%;\n    }\n  "
                    ]
                },] },
    ];
    /** @nocollapse */
    ProgressbarComponent.ctorParameters = function () { return [
        { type: ProgressbarConfig, },
    ]; };
    ProgressbarComponent.propDecorators = {
        'animate': [{ type: Input },],
        'max': [{ type: Input },],
        'type': [{ type: Input },],
        'value': [{ type: Input },],
    };
    return ProgressbarComponent;
}());

var RATING_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line
    useExisting: forwardRef(function () { return RatingComponent; }),
    multi: true
};
var RatingComponent = (function () {
    function RatingComponent(changeDetection) {
        this.changeDetection = changeDetection;
        /** number of icons */
        this.max = 5;
        /** fired when icon selected, $event:number equals to selected rating */
        this.onHover = new EventEmitter();
        /** fired when icon selected, $event:number equals to previous rating value */
        this.onLeave = new EventEmitter();
        this.onChange = Function.prototype;
        this.onTouched = Function.prototype;
    }
    RatingComponent.prototype.onKeydown = function (event) {
        if ([37, 38, 39, 40].indexOf(event.which) === -1) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        var sign = event.which === 38 || event.which === 39 ? 1 : -1;
        this.rate(this.value + sign);
    };
    RatingComponent.prototype.ngOnInit = function () {
        this.max = typeof this.max !== 'undefined' ? this.max : 5;
        this.titles =
            typeof this.titles !== 'undefined' && this.titles.length > 0
                ? this.titles
                : ['one', 'two', 'three', 'four', 'five'];
        this.range = this.buildTemplateObjects(this.max);
    };
    // model -> view
    RatingComponent.prototype.writeValue = function (value) {
        if (value % 1 !== value) {
            this.value = Math.round(value);
            this.preValue = value;
            this.changeDetection.markForCheck();
            return;
        }
        this.preValue = value;
        this.value = value;
        this.changeDetection.markForCheck();
    };
    RatingComponent.prototype.enter = function (value) {
        if (!this.readonly) {
            this.value = value;
            this.changeDetection.markForCheck();
            this.onHover.emit(value);
        }
    };
    RatingComponent.prototype.reset = function () {
        this.value = this.preValue;
        this.changeDetection.markForCheck();
        this.onLeave.emit(this.value);
    };
    RatingComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    RatingComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    RatingComponent.prototype.rate = function (value) {
        if (!this.readonly && value >= 0 && value <= this.range.length) {
            this.writeValue(value);
            this.onChange(value);
        }
    };
    RatingComponent.prototype.buildTemplateObjects = function (max) {
        var result = [];
        for (var i = 0; i < max; i++) {
            result.push({
                index: i,
                title: this.titles[i] || i + 1
            });
        }
        return result;
    };
    RatingComponent.decorators = [
        { type: Component, args: [{
                    selector: 'rating',
                    template: "<span (mouseleave)=\"reset()\" (keydown)=\"onKeydown($event)\" tabindex=\"0\" role=\"slider\" aria-valuemin=\"0\" [attr.aria-valuemax]=\"range.length\" [attr.aria-valuenow]=\"value\"> <ng-template #star let-value=\"value\" let-index=\"index\">{{index < value ? '&#9733;' : '&#9734;'}}</ng-template> <ng-template ngFor let-r [ngForOf]=\"range\" let-index=\"index\"> <span class=\"sr-only\">({{ index < value ? '*' : ' ' }})</span> <span class=\"bs-rating-star\" (mouseenter)=\"enter(index + 1)\" (click)=\"rate(index + 1)\" [title]=\"r.title\" [style.cursor]=\"readonly ? 'default' : 'pointer'\" [class.active]=\"index < value\"> <ng-template [ngTemplateOutlet]=\"customTemplate || star\" [ngTemplateOutletContext]=\"{index: index, value: value}\"> </ng-template> </span> </ng-template> </span> ",
                    providers: [RATING_CONTROL_VALUE_ACCESSOR],
                    changeDetection: ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    RatingComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
    ]; };
    RatingComponent.propDecorators = {
        'max': [{ type: Input },],
        'readonly': [{ type: Input },],
        'titles': [{ type: Input },],
        'customTemplate': [{ type: Input },],
        'onHover': [{ type: Output },],
        'onLeave': [{ type: Output },],
        'onKeydown': [{ type: HostListener, args: ['keydown', ['$event'],] },],
    };
    return RatingComponent;
}());

var DraggableItemService = (function () {
    function DraggableItemService() {
        this.onCapture = new Subject$1();
    }
    DraggableItemService.prototype.dragStart = function (item) {
        this.draggableItem = item;
    };
    DraggableItemService.prototype.getItem = function () {
        return this.draggableItem;
    };
    DraggableItemService.prototype.captureItem = function (overZoneIndex, newIndex) {
        if (this.draggableItem.overZoneIndex !== overZoneIndex) {
            this.draggableItem.lastZoneIndex = this.draggableItem.overZoneIndex;
            this.draggableItem.overZoneIndex = overZoneIndex;
            this.onCapture.next(this.draggableItem);
            this.draggableItem = Object.assign({}, this.draggableItem, {
                overZoneIndex: overZoneIndex,
                i: newIndex
            });
        }
        return this.draggableItem;
    };
    DraggableItemService.prototype.onCaptureItem = function () {
        return this.onCapture;
    };
    DraggableItemService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DraggableItemService.ctorParameters = function () { return []; };
    return DraggableItemService;
}());

/* tslint:disable */
/* tslint:enable */
var SortableComponent = (function () {
    function SortableComponent(transfer) {
        var _this = this;
        /** class name for items wrapper */
        this.wrapperClass = '';
        /** style object for items wrapper */
        this.wrapperStyle = {};
        /** class name for item */
        this.itemClass = '';
        /** style object for item */
        this.itemStyle = {};
        /** class name for active item */
        this.itemActiveClass = '';
        /** style object for active item */
        this.itemActiveStyle = {};
        /** class name for placeholder */
        this.placeholderClass = '';
        /** style object for placeholder */
        this.placeholderStyle = {};
        /** placeholder item which will be shown if collection is empty */
        this.placeholderItem = '';
        /** fired on array change (reordering, insert, remove), same as <code>ngModelChange</code>.
         *  Returns new items collection as a payload.
         */
        this.onChange = new EventEmitter();
        this.showPlaceholder = false;
        this.activeItem = -1;
        this.onTouched = Function.prototype;
        this.onChanged = Function.prototype;
        this.transfer = transfer;
        this.currentZoneIndex = SortableComponent.globalZoneIndex++;
        this.transfer
            .onCaptureItem()
            .subscribe(function (item) { return _this.onDrop(item); });
    }
    Object.defineProperty(SortableComponent.prototype, "items", {
        get: function () {
            return this._items;
        },
        set: function (value) {
            this._items = value;
            var out = this.items.map(function (x) { return x.initData; });
            this.onChanged(out);
            this.onChange.emit(out);
        },
        enumerable: true,
        configurable: true
    });
    SortableComponent.prototype.onItemDragstart = function (event, item, i) {
        this.initDragstartEvent(event);
        this.onTouched();
        this.transfer.dragStart({
            event: event,
            item: item,
            i: i,
            initialIndex: i,
            lastZoneIndex: this.currentZoneIndex,
            overZoneIndex: this.currentZoneIndex
        });
    };
    SortableComponent.prototype.onItemDragover = function (event, i) {
        if (!this.transfer.getItem()) {
            return;
        }
        event.preventDefault();
        var dragItem = this.transfer.captureItem(this.currentZoneIndex, this.items.length);
        var newArray = [];
        if (!this.items.length) {
            newArray = [dragItem.item];
        }
        else if (dragItem.i > i) {
            newArray = this.items.slice(0, i).concat([
                dragItem.item
            ], this.items.slice(i, dragItem.i), this.items.slice(dragItem.i + 1));
        }
        else {
            // this.draggedItem.i < i
            newArray = this.items.slice(0, dragItem.i).concat(this.items.slice(dragItem.i + 1, i + 1), [
                dragItem.item
            ], this.items.slice(i + 1));
        }
        this.items = newArray;
        dragItem.i = i;
        this.activeItem = i;
        this.updatePlaceholderState();
    };
    SortableComponent.prototype.cancelEvent = function (event) {
        if (!this.transfer.getItem() || !event) {
            return;
        }
        event.preventDefault();
    };
    SortableComponent.prototype.onDrop = function (item) {
        if (item &&
            item.overZoneIndex !== this.currentZoneIndex &&
            item.lastZoneIndex === this.currentZoneIndex) {
            this.items = this.items.filter(function (x, i) { return i !== item.i; });
            this.updatePlaceholderState();
        }
        this.resetActiveItem(undefined);
    };
    SortableComponent.prototype.resetActiveItem = function (event) {
        this.cancelEvent(event);
        this.activeItem = -1;
    };
    SortableComponent.prototype.registerOnChange = function (callback) {
        this.onChanged = callback;
    };
    SortableComponent.prototype.registerOnTouched = function (callback) {
        this.onTouched = callback;
    };
    SortableComponent.prototype.writeValue = function (value) {
        var _this = this;
        if (value) {
            this.items = value.map(function (x, i) { return ({
                id: i,
                initData: x,
                value: _this.fieldName ? x[_this.fieldName] : x
            }); });
        }
        else {
            this.items = [];
        }
        this.updatePlaceholderState();
    };
    SortableComponent.prototype.updatePlaceholderState = function () {
        this.showPlaceholder = !this._items.length;
    };
    SortableComponent.prototype.getItemStyle = function (isActive) {
        return isActive
            ? Object.assign({}, this.itemStyle, this.itemActiveStyle)
            : this.itemStyle;
    };
    // tslint:disable-next-line
    SortableComponent.prototype.initDragstartEvent = function (event) {
        // it is necessary for mozilla
        // data type should be 'Text' instead of 'text/plain' to keep compatibility
        // with IE
        event.dataTransfer.setData('Text', 'placeholder');
    };
    SortableComponent.globalZoneIndex = 0;
    SortableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-sortable',
                    exportAs: 'bs-sortable',
                    template: "\n<div\n    [ngClass]=\"wrapperClass\"\n    [ngStyle]=\"wrapperStyle\"\n    [ngStyle]=\"wrapperStyle\"\n    (dragover)=\"cancelEvent($event)\"\n    (dragenter)=\"cancelEvent($event)\"\n    (drop)=\"resetActiveItem($event)\"\n    (mouseleave)=\"resetActiveItem($event)\">\n  <div\n        *ngIf=\"showPlaceholder\"\n        [ngClass]=\"placeholderClass\"\n        [ngStyle]=\"placeholderStyle\"\n        (dragover)=\"onItemDragover($event, 0)\"\n        (dragenter)=\"cancelEvent($event)\"\n    >{{placeholderItem}}</div>\n    <div\n        *ngFor=\"let item of items; let i=index;\"\n        [ngClass]=\"[ itemClass, i === activeItem ? itemActiveClass : '' ]\"\n        [ngStyle]=\"getItemStyle(i === activeItem)\"\n        draggable=\"true\"\n        (dragstart)=\"onItemDragstart($event, item, i)\"\n        (dragend)=\"resetActiveItem($event)\"\n        (dragover)=\"onItemDragover($event, i)\"\n        (dragenter)=\"cancelEvent($event)\"\n    ><ng-template [ngTemplateOutlet]=\"itemTemplate || defItemTemplate\"\n  [ngTemplateOutletContext]=\"{item:item, index: i}\"></ng-template></div>\n</div>\n\n<ng-template #defItemTemplate let-item=\"item\">{{item.value}}</ng-template>  \n",
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return SortableComponent; }),
                            multi: true
                        }
                    ]
                },] },
    ];
    /** @nocollapse */
    SortableComponent.ctorParameters = function () { return [
        { type: DraggableItemService, },
    ]; };
    SortableComponent.propDecorators = {
        'fieldName': [{ type: Input },],
        'wrapperClass': [{ type: Input },],
        'wrapperStyle': [{ type: Input },],
        'itemClass': [{ type: Input },],
        'itemStyle': [{ type: Input },],
        'itemActiveClass': [{ type: Input },],
        'itemActiveStyle': [{ type: Input },],
        'placeholderClass': [{ type: Input },],
        'placeholderStyle': [{ type: Input },],
        'placeholderItem': [{ type: Input },],
        'itemTemplate': [{ type: Input },],
        'onChange': [{ type: Output },],
    };
    return SortableComponent;
}());

var NgTranscludeDirective = (function () {
    function NgTranscludeDirective(viewRef) {
        this.viewRef = viewRef;
    }
    Object.defineProperty(NgTranscludeDirective.prototype, "ngTransclude", {
        get: function () {
            return this._ngTransclude;
        },
        set: function (templateRef) {
            this._ngTransclude = templateRef;
            if (templateRef) {
                this.viewRef.createEmbeddedView(templateRef);
            }
        },
        enumerable: true,
        configurable: true
    });
    NgTranscludeDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[ngTransclude]'
                },] },
    ];
    /** @nocollapse */
    NgTranscludeDirective.ctorParameters = function () { return [
        { type: ViewContainerRef, },
    ]; };
    NgTranscludeDirective.propDecorators = {
        'ngTransclude': [{ type: Input },],
    };
    return NgTranscludeDirective;
}());

var TabsetConfig = (function () {
    function TabsetConfig() {
        /** provides default navigation context class: 'tabs' or 'pills' */
        this.type = 'tabs';
    }
    TabsetConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TabsetConfig.ctorParameters = function () { return []; };
    return TabsetConfig;
}());

// todo: add active event to tab
// todo: fix? mixing static and dynamic tabs position tabs in order of creation
var TabsetComponent = (function () {
    function TabsetComponent(config, renderer) {
        this.renderer = renderer;
        this.clazz = true;
        this.tabs = [];
        this.classMap = {};
        Object.assign(this, config);
    }
    Object.defineProperty(TabsetComponent.prototype, "vertical", {
        /** if true tabs will be placed vertically */
        get: function () {
            return this._vertical;
        },
        set: function (value) {
            this._vertical = value;
            this.setClassMap();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabsetComponent.prototype, "justified", {
        /** if true tabs fill the container and have a consistent width */
        get: function () {
            return this._justified;
        },
        set: function (value) {
            this._justified = value;
            this.setClassMap();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabsetComponent.prototype, "type", {
        /** navigation context class: 'tabs' or 'pills' */
        get: function () {
            return this._type;
        },
        set: function (value) {
            this._type = value;
            this.setClassMap();
        },
        enumerable: true,
        configurable: true
    });
    TabsetComponent.prototype.ngOnDestroy = function () {
        this.isDestroyed = true;
    };
    TabsetComponent.prototype.addTab = function (tab) {
        this.tabs.push(tab);
        tab.active = this.tabs.length === 1 && typeof tab.active === 'undefined';
    };
    TabsetComponent.prototype.removeTab = function (tab, options) {
        if (options === void 0) { options = { reselect: true, emit: true }; }
        var index = this.tabs.indexOf(tab);
        if (index === -1 || this.isDestroyed) {
            return;
        }
        // Select a new tab if the tab to be removed is selected and not destroyed
        if (options.reselect && tab.active && this.hasAvailableTabs(index)) {
            var newActiveIndex = this.getClosestTabIndex(index);
            this.tabs[newActiveIndex].active = true;
        }
        if (options.emit) {
            tab.removed.emit(tab);
        }
        this.tabs.splice(index, 1);
        if (tab.elementRef.nativeElement.parentNode) {
            this.renderer.removeChild(tab.elementRef.nativeElement.parentNode, tab.elementRef.nativeElement);
        }
    };
    TabsetComponent.prototype.getClosestTabIndex = function (index) {
        var tabsLength = this.tabs.length;
        if (!tabsLength) {
            return -1;
        }
        for (var step = 1; step <= tabsLength; step += 1) {
            var prevIndex = index - step;
            var nextIndex = index + step;
            if (this.tabs[prevIndex] && !this.tabs[prevIndex].disabled) {
                return prevIndex;
            }
            if (this.tabs[nextIndex] && !this.tabs[nextIndex].disabled) {
                return nextIndex;
            }
        }
        return -1;
    };
    TabsetComponent.prototype.hasAvailableTabs = function (index) {
        var tabsLength = this.tabs.length;
        if (!tabsLength) {
            return false;
        }
        for (var i = 0; i < tabsLength; i += 1) {
            if (!this.tabs[i].disabled && i !== index) {
                return true;
            }
        }
        return false;
    };
    TabsetComponent.prototype.setClassMap = function () {
        this.classMap = (_a = {
                'nav-stacked': this.vertical,
                'flex-column': this.vertical,
                'nav-justified': this.justified
            }, _a["nav-" + this.type] = true, _a);
        var _a;
    };
    TabsetComponent.decorators = [
        { type: Component, args: [{
                    selector: 'tabset',
                    template: "<ul class=\"nav\" [ngClass]=\"classMap\" (click)=\"$event.preventDefault()\"> <li *ngFor=\"let tabz of tabs\" [ngClass]=\"['nav-item', tabz.customClass || '']\" [class.active]=\"tabz.active\" [class.disabled]=\"tabz.disabled\"> <a href=\"javascript:void(0);\" class=\"nav-link\" [attr.id]=\"tabz.id ? tabz.id + '-link' : ''\" [class.active]=\"tabz.active\" [class.disabled]=\"tabz.disabled\" (click)=\"tabz.active = true\"> <span [ngTransclude]=\"tabz.headingRef\">{{ tabz.heading }}</span> <span *ngIf=\"tabz.removable\" (click)=\"$event.preventDefault(); removeTab(tabz);\" class=\"bs-remove-tab\"> &#10060;</span> </a> </li> </ul> <div class=\"tab-content\"> <ng-content></ng-content> </div> "
                },] },
    ];
    /** @nocollapse */
    TabsetComponent.ctorParameters = function () { return [
        { type: TabsetConfig, },
        { type: Renderer2, },
    ]; };
    TabsetComponent.propDecorators = {
        'vertical': [{ type: Input },],
        'justified': [{ type: Input },],
        'type': [{ type: Input },],
        'clazz': [{ type: HostBinding, args: ['class.tab-container',] },],
    };
    return TabsetComponent;
}());

var TabDirective = (function () {
    function TabDirective(tabset, elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        /** fired when tab became active, $event:Tab equals to selected instance of Tab component */
        this.select = new EventEmitter();
        /** fired when tab became inactive, $event:Tab equals to deselected instance of Tab component */
        this.deselect = new EventEmitter();
        /** fired before tab will be removed, $event:Tab equals to instance of removed tab */
        this.removed = new EventEmitter();
        this.addClass = true;
        this.tabset = tabset;
        this.tabset.addTab(this);
    }
    Object.defineProperty(TabDirective.prototype, "customClass", {
        /** if set, will be added to the tab's class attribute. Multiple classes are supported. */
        get: function () {
            return this._customClass;
        },
        set: function (customClass) {
            var _this = this;
            if (this.customClass) {
                this.customClass.split(' ').forEach(function (cssClass) {
                    _this.renderer.removeClass(_this.elementRef.nativeElement, cssClass);
                });
            }
            this._customClass = customClass ? customClass.trim() : null;
            if (this.customClass) {
                this.customClass.split(' ').forEach(function (cssClass) {
                    _this.renderer.addClass(_this.elementRef.nativeElement, cssClass);
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabDirective.prototype, "active", {
        /** tab active state toggle */
        get: function () {
            return this._active;
        },
        set: function (active) {
            var _this = this;
            if (this._active === active) {
                return;
            }
            if ((this.disabled && active) || !active) {
                if (this._active && !active) {
                    this.deselect.emit(this);
                    this._active = active;
                }
                return;
            }
            this._active = active;
            this.select.emit(this);
            this.tabset.tabs.forEach(function (tab) {
                if (tab !== _this) {
                    tab.active = false;
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    TabDirective.prototype.ngOnInit = function () {
        this.removable = this.removable;
    };
    TabDirective.prototype.ngOnDestroy = function () {
        this.tabset.removeTab(this, { reselect: false, emit: false });
    };
    TabDirective.decorators = [
        { type: Directive, args: [{ selector: 'tab, [tab]' },] },
    ];
    /** @nocollapse */
    TabDirective.ctorParameters = function () { return [
        { type: TabsetComponent, },
        { type: ElementRef, },
        { type: Renderer2, },
    ]; };
    TabDirective.propDecorators = {
        'heading': [{ type: Input },],
        'id': [{ type: HostBinding, args: ['attr.id',] }, { type: Input },],
        'disabled': [{ type: Input },],
        'removable': [{ type: Input },],
        'customClass': [{ type: Input },],
        'active': [{ type: HostBinding, args: ['class.active',] }, { type: Input },],
        'select': [{ type: Output },],
        'deselect': [{ type: Output },],
        'removed': [{ type: Output },],
        'addClass': [{ type: HostBinding, args: ['class.tab-pane',] },],
    };
    return TabDirective;
}());

var TimepickerActions = (function () {
    function TimepickerActions() {
    }
    TimepickerActions.prototype.writeValue = function (value) {
        return {
            type: TimepickerActions.WRITE_VALUE,
            payload: value
        };
    };
    TimepickerActions.prototype.changeHours = function (event) {
        return {
            type: TimepickerActions.CHANGE_HOURS,
            payload: event
        };
    };
    TimepickerActions.prototype.changeMinutes = function (event) {
        return {
            type: TimepickerActions.CHANGE_MINUTES,
            payload: event
        };
    };
    TimepickerActions.prototype.changeSeconds = function (event) {
        return {
            type: TimepickerActions.CHANGE_SECONDS,
            payload: event
        };
    };
    TimepickerActions.prototype.setTime = function (value) {
        return {
            type: TimepickerActions.SET_TIME_UNIT,
            payload: value
        };
    };
    TimepickerActions.prototype.updateControls = function (value) {
        return {
            type: TimepickerActions.UPDATE_CONTROLS,
            payload: value
        };
    };
    TimepickerActions.WRITE_VALUE = '[timepicker] write value from ng model';
    TimepickerActions.CHANGE_HOURS = '[timepicker] change hours';
    TimepickerActions.CHANGE_MINUTES = '[timepicker] change minutes';
    TimepickerActions.CHANGE_SECONDS = '[timepicker] change seconds';
    TimepickerActions.SET_TIME_UNIT = '[timepicker] set time unit';
    TimepickerActions.UPDATE_CONTROLS = '[timepicker] update controls';
    TimepickerActions.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TimepickerActions.ctorParameters = function () { return []; };
    return TimepickerActions;
}());

var dex = 10;
var hoursPerDay = 24;
var hoursPerDayHalf = 12;
var minutesPerHour = 60;
var secondsPerMinute = 60;
function isValidDate(value) {
    if (!value) {
        return false;
    }
    if (value instanceof Date && isNaN(value.getHours())) {
        return false;
    }
    if (typeof value === 'string') {
        return isValidDate(new Date(value));
    }
    return true;
}
function toNumber(value) {
    if (typeof value === 'number') {
        return value;
    }
    return parseInt(value, dex);
}

function parseHours(value, isPM) {
    if (isPM === void 0) { isPM = false; }
    var hour = toNumber(value);
    if (isNaN(hour) ||
        hour < 0 ||
        hour > (isPM ? hoursPerDayHalf : hoursPerDay)) {
        return NaN;
    }
    return hour;
}
function parseMinutes(value) {
    var minute = toNumber(value);
    if (isNaN(minute) || minute < 0 || minute > minutesPerHour) {
        return NaN;
    }
    return minute;
}
function parseSeconds(value) {
    var seconds = toNumber(value);
    if (isNaN(seconds) || seconds < 0 || seconds > secondsPerMinute) {
        return NaN;
    }
    return seconds;
}
function parseTime(value) {
    if (typeof value === 'string') {
        return new Date(value);
    }
    return value;
}
function changeTime(value, diff) {
    if (!value) {
        return changeTime(createDate$1(new Date(), 0, 0, 0), diff);
    }
    var hour = value.getHours();
    var minutes = value.getMinutes();
    var seconds = value.getSeconds();
    if (diff.hour) {
        hour = (hour + toNumber(diff.hour)) % hoursPerDay;
        if (hour < 0) {
            hour += hoursPerDay;
        }
    }
    if (diff.minute) {
        minutes = minutes + toNumber(diff.minute);
    }
    if (diff.seconds) {
        seconds = seconds + toNumber(diff.seconds);
    }
    return createDate$1(value, hour, minutes, seconds);
}
function setTime(value, opts) {
    var hour = parseHours(opts.hour);
    var minute = parseMinutes(opts.minute);
    var seconds = parseSeconds(opts.seconds) || 0;
    if (opts.isPM) {
        hour += hoursPerDayHalf;
    }
    // fixme: unreachable code, value is mandatory
    if (!value) {
        if (!isNaN(hour) && !isNaN(minute)) {
            return createDate$1(new Date(), hour, minute, seconds);
        }
        return value;
    }
    if (isNaN(hour) || isNaN(minute)) {
        return value;
    }
    return createDate$1(value, hour, minute, seconds);
}
function createDate$1(value, hours, minutes, seconds) {
    // fixme: unreachable code, value is mandatory
    var _value = value || new Date();
    return new Date(_value.getFullYear(), _value.getMonth(), _value.getDate(), hours, minutes, seconds, _value.getMilliseconds());
}
function padNumber(value) {
    var _value = value.toString();
    if (_value.length > 1) {
        return _value;
    }
    return "0" + _value;
}
function isInputValid(hours, minutes, seconds, isPM) {
    if (seconds === void 0) { seconds = '0'; }
    return !(isNaN(parseHours(hours, isPM))
        || isNaN(parseMinutes(minutes))
        || isNaN(parseSeconds(seconds)));
}

function canChangeValue(state, event) {
    if (state.readonlyInput) {
        return false;
    }
    if (event) {
        if (event.source === 'wheel' && !state.mousewheel) {
            return false;
        }
        if (event.source === 'key' && !state.arrowkeys) {
            return false;
        }
    }
    return true;
}
function canChangeHours(event, controls) {
    if (!event.step) {
        return false;
    }
    if (event.step > 0 && !controls.canIncrementHours) {
        return false;
    }
    if (event.step < 0 && !controls.canDecrementHours) {
        return false;
    }
    return true;
}
function canChangeMinutes(event, controls) {
    if (!event.step) {
        return false;
    }
    if (event.step > 0 && !controls.canIncrementMinutes) {
        return false;
    }
    if (event.step < 0 && !controls.canDecrementMinutes) {
        return false;
    }
    return true;
}
function canChangeSeconds(event, controls) {
    if (!event.step) {
        return false;
    }
    if (event.step > 0 && !controls.canIncrementSeconds) {
        return false;
    }
    if (event.step < 0 && !controls.canDecrementSeconds) {
        return false;
    }
    return true;
}
function getControlsValue(state) {
    var hourStep = state.hourStep, minuteStep = state.minuteStep, secondsStep = state.secondsStep, readonlyInput = state.readonlyInput, mousewheel = state.mousewheel, arrowkeys = state.arrowkeys, showSpinners = state.showSpinners, showMeridian = state.showMeridian, showSeconds = state.showSeconds, meridians = state.meridians, min = state.min, max = state.max;
    return {
        hourStep: hourStep,
        minuteStep: minuteStep,
        secondsStep: secondsStep,
        readonlyInput: readonlyInput,
        mousewheel: mousewheel,
        arrowkeys: arrowkeys,
        showSpinners: showSpinners,
        showMeridian: showMeridian,
        showSeconds: showSeconds,
        meridians: meridians,
        min: min,
        max: max
    };
}
function timepickerControls(value, state) {
    var min = state.min, max = state.max, hourStep = state.hourStep, minuteStep = state.minuteStep, secondsStep = state.secondsStep, showSeconds = state.showSeconds;
    var res = {
        canIncrementHours: true,
        canIncrementMinutes: true,
        canIncrementSeconds: true,
        canDecrementHours: true,
        canDecrementMinutes: true,
        canDecrementSeconds: true
    };
    if (!value) {
        return res;
    }
    // compare dates
    if (max) {
        var _newHour = changeTime(value, { hour: hourStep });
        res.canIncrementHours = max > _newHour;
        if (!res.canIncrementHours) {
            var _newMinutes = changeTime(value, { minute: minuteStep });
            res.canIncrementMinutes = showSeconds
                ? max > _newMinutes
                : max >= _newMinutes;
        }
        if (!res.canIncrementMinutes) {
            var _newSeconds = changeTime(value, { seconds: secondsStep });
            res.canIncrementSeconds = max >= _newSeconds;
        }
    }
    if (min) {
        var _newHour = changeTime(value, { hour: -hourStep });
        res.canDecrementHours = min < _newHour;
        if (!res.canDecrementHours) {
            var _newMinutes = changeTime(value, { minute: -minuteStep });
            res.canDecrementMinutes = showSeconds
                ? min < _newMinutes
                : min <= _newMinutes;
        }
        if (!res.canDecrementMinutes) {
            var _newSeconds = changeTime(value, { seconds: -secondsStep });
            res.canDecrementSeconds = min <= _newSeconds;
        }
    }
    return res;
}

/** Provides default configuration values for timepicker */
var TimepickerConfig = (function () {
    function TimepickerConfig() {
        /** hours change step */
        this.hourStep = 1;
        /** hours change step */
        this.minuteStep = 5;
        /** seconds changes step */
        this.secondsStep = 10;
        /** if true works in 12H mode and displays AM/PM. If false works in 24H mode and hides AM/PM */
        this.showMeridian = true;
        /** meridian labels based on locale */
        this.meridians = ['AM', 'PM'];
        /** if true hours and minutes fields will be readonly */
        this.readonlyInput = false;
        /** if true scroll inside hours and minutes inputs will change time */
        this.mousewheel = true;
        /** if true up/down arrowkeys inside hours and minutes inputs will change time */
        this.arrowkeys = true;
        /** if true spinner arrows above and below the inputs will be shown */
        this.showSpinners = true;
        /** show seconds in timepicker */
        this.showSeconds = false;
    }
    TimepickerConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TimepickerConfig.ctorParameters = function () { return []; };
    return TimepickerConfig;
}());

var initialState = {
    value: null,
    config: new TimepickerConfig(),
    controls: {
        canIncrementHours: true,
        canIncrementMinutes: true,
        canIncrementSeconds: true,
        canDecrementHours: true,
        canDecrementMinutes: true,
        canDecrementSeconds: true
    }
};
function timepickerReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case TimepickerActions.WRITE_VALUE: {
            return Object.assign({}, state, { value: action.payload });
        }
        case TimepickerActions.CHANGE_HOURS: {
            if (!canChangeValue(state.config, action.payload) ||
                !canChangeHours(action.payload, state.controls)) {
                return state;
            }
            var _newTime = changeTime(state.value, { hour: action.payload.step });
            return Object.assign({}, state, { value: _newTime });
        }
        case TimepickerActions.CHANGE_MINUTES: {
            if (!canChangeValue(state.config, action.payload) ||
                !canChangeMinutes(action.payload, state.controls)) {
                return state;
            }
            var _newTime = changeTime(state.value, { minute: action.payload.step });
            return Object.assign({}, state, { value: _newTime });
        }
        case TimepickerActions.CHANGE_SECONDS: {
            if (!canChangeValue(state.config, action.payload) ||
                !canChangeSeconds(action.payload, state.controls)) {
                return state;
            }
            var _newTime = changeTime(state.value, {
                seconds: action.payload.step
            });
            return Object.assign({}, state, { value: _newTime });
        }
        case TimepickerActions.SET_TIME_UNIT: {
            if (!canChangeValue(state.config)) {
                return state;
            }
            var _newTime = setTime(state.value, action.payload);
            return Object.assign({}, state, { value: _newTime });
        }
        case TimepickerActions.UPDATE_CONTROLS: {
            var _newControlsState = timepickerControls(state.value, action.payload);
            var _newState = {
                value: state.value,
                config: action.payload,
                controls: _newControlsState
            };
            if (state.config.showMeridian !== _newState.config.showMeridian) {
                _newState.value = new Date(state.value);
            }
            return Object.assign({}, state, _newState);
        }
        default:
            return state;
    }
}

var __extends$11 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TimepickerStore = (function (_super) {
    __extends$11(TimepickerStore, _super);
    function TimepickerStore() {
        var _this = this;
        var _dispatcher = new BehaviorSubject$1({
            type: '[mini-ngrx] dispatcher init'
        });
        var state = new MiniState(initialState, _dispatcher, timepickerReducer);
        _this = _super.call(this, _dispatcher, timepickerReducer, state) || this;
        return _this;
    }
    TimepickerStore.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TimepickerStore.ctorParameters = function () { return []; };
    return TimepickerStore;
}(MiniStore));

/* tslint:disable:no-forward-ref max-file-line-count */
var TIMEPICKER_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line
    useExisting: forwardRef(function () { return TimepickerComponent; }),
    multi: true
};
var TimepickerComponent = (function () {
    function TimepickerComponent(_config, _cd, _store, _timepickerActions) {
        var _this = this;
        this._store = _store;
        this._timepickerActions = _timepickerActions;
        /** emits true if value is a valid date */
        this.isValid = new EventEmitter();
        // min\max validation for input fields
        this.invalidHours = false;
        this.invalidMinutes = false;
        this.invalidSeconds = false;
        // control value accessor methods
        this.onChange = Function.prototype;
        this.onTouched = Function.prototype;
        Object.assign(this, _config);
        // todo: add unsubscribe
        _store.select(function (state) { return state.value; }).subscribe(function (value) {
            // update UI values if date changed
            _this._renderTime(value);
            _this.onChange(value);
            _this._store.dispatch(_this._timepickerActions.updateControls(getControlsValue(_this)));
        });
        _store.select(function (state) { return state.controls; }).subscribe(function (controlsState) {
            _this.isValid.emit(isInputValid(_this.hours, _this.minutes, _this.seconds, _this.isPM()));
            Object.assign(_this, controlsState);
            _cd.markForCheck();
        });
    }
    Object.defineProperty(TimepickerComponent.prototype, "isSpinnersVisible", {
        get: function () {
            return this.showSpinners && !this.readonlyInput;
        },
        enumerable: true,
        configurable: true
    });
    TimepickerComponent.prototype.isPM = function () {
        return this.showMeridian && this.meridian === this.meridians[1];
    };
    TimepickerComponent.prototype.prevDef = function ($event) {
        $event.preventDefault();
    };
    TimepickerComponent.prototype.wheelSign = function ($event) {
        return Math.sign($event.deltaY) * -1;
    };
    TimepickerComponent.prototype.ngOnChanges = function (changes) {
        this._store.dispatch(this._timepickerActions.updateControls(getControlsValue(this)));
    };
    TimepickerComponent.prototype.changeHours = function (step, source) {
        if (source === void 0) { source = ''; }
        this._store.dispatch(this._timepickerActions.changeHours({ step: step, source: source }));
    };
    TimepickerComponent.prototype.changeMinutes = function (step, source) {
        if (source === void 0) { source = ''; }
        this._store.dispatch(this._timepickerActions.changeMinutes({ step: step, source: source }));
    };
    TimepickerComponent.prototype.changeSeconds = function (step, source) {
        if (source === void 0) { source = ''; }
        this._store.dispatch(this._timepickerActions.changeSeconds({ step: step, source: source }));
    };
    TimepickerComponent.prototype.updateHours = function (hours) {
        this.hours = hours;
        this._updateTime();
    };
    TimepickerComponent.prototype.updateMinutes = function (minutes) {
        this.minutes = minutes;
        this._updateTime();
    };
    TimepickerComponent.prototype.updateSeconds = function (seconds) {
        this.seconds = seconds;
        this._updateTime();
    };
    TimepickerComponent.prototype._updateTime = function () {
        var _seconds = this.showSeconds ? this.seconds : void 0;
        if (!isInputValid(this.hours, this.minutes, _seconds, this.isPM())) {
            this.onChange(null);
            return;
        }
        this._store.dispatch(this._timepickerActions.setTime({
            hour: this.hours,
            minute: this.minutes,
            seconds: this.seconds,
            isPM: this.isPM()
        }));
    };
    TimepickerComponent.prototype.toggleMeridian = function () {
        if (!this.showMeridian || this.readonlyInput) {
            return;
        }
        var _hoursPerDayHalf = 12;
        this._store.dispatch(this._timepickerActions.changeHours({
            step: _hoursPerDayHalf,
            source: ''
        }));
    };
    /**
     * Write a new value to the element.
     */
    TimepickerComponent.prototype.writeValue = function (obj) {
        if (isValidDate(obj)) {
            this._store.dispatch(this._timepickerActions.writeValue(parseTime(obj)));
        }
    };
    /**
     * Set the function to be called when the control receives a change event.
     */
    TimepickerComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /**
     * Set the function to be called when the control receives a touch event.
     */
    TimepickerComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * This function is called when the control status changes to or from "DISABLED".
     * Depending on the value, it will enable or disable the appropriate DOM element.
     *
     * @param isDisabled
     */
    TimepickerComponent.prototype.setDisabledState = function (isDisabled) {
        this.readonlyInput = isDisabled;
    };
    TimepickerComponent.prototype._renderTime = function (value) {
        if (!isValidDate(value)) {
            this.hours = '';
            this.minutes = '';
            this.seconds = '';
            this.meridian = this.meridians[0];
            return;
        }
        var _value = parseTime(value);
        var _hoursPerDayHalf = 12;
        var _hours = _value.getHours();
        if (this.showMeridian) {
            this.meridian = this.meridians[_hours >= _hoursPerDayHalf ? 1 : 0];
            _hours = _hours % _hoursPerDayHalf;
            // should be 12 PM, not 00 PM
            if (_hours === 0) {
                _hours = _hoursPerDayHalf;
            }
        }
        this.hours = padNumber(_hours);
        this.minutes = padNumber(_value.getMinutes());
        this.seconds = padNumber(_value.getUTCSeconds());
    };
    TimepickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'timepicker',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [TIMEPICKER_CONTROL_VALUE_ACCESSOR, TimepickerStore],
                    template: "<table> <tbody> <tr class=\"text-center\" [class.hidden]=\"!isSpinnersVisible\"> <!-- increment hours button--> <td> <a class=\"btn btn-link\" [class.disabled]=\"!canIncrementHours\" (click)=\"changeHours(hourStep)\" ><span class=\"bs-chevron bs-chevron-up\"></span></a> </td> <!-- divider --> <td>&nbsp;&nbsp;&nbsp;</td> <!-- increment minutes button --> <td> <a class=\"btn btn-link\" [class.disabled]=\"!canIncrementMinutes\" (click)=\"changeMinutes(minuteStep)\" ><span class=\"bs-chevron bs-chevron-up\"></span></a> </td> <!-- divider --> <td *ngIf=\"showSeconds\">&nbsp;</td> <!-- increment seconds button --> <td *ngIf=\"showSeconds\"> <a class=\"btn btn-link\" [class.disabled]=\"!canIncrementSeconds\" (click)=\"changeSeconds(secondsStep)\"> <span class=\"bs-chevron bs-chevron-up\"></span> </a> </td> <!-- space between --> <td>&nbsp;&nbsp;&nbsp;</td> <!-- meridian placeholder--> <td *ngIf=\"showMeridian\"></td> </tr> <tr> <!-- hours --> <td class=\"form-group\" [class.has-error]=\"invalidHours\"> <input type=\"text\" class=\"form-control text-center bs-timepicker-field\" placeholder=\"HH\" maxlength=\"2\" [readonly]=\"readonlyInput\" [value]=\"hours\" (wheel)=\"prevDef($event);changeHours(hourStep * wheelSign($event), 'wheel')\" (keydown.ArrowUp)=\"changeHours(hourStep, 'key')\" (keydown.ArrowDown)=\"changeHours(-hourStep, 'key')\" (change)=\"updateHours($event.target.value)\"></td> <!-- divider --> <td>&nbsp;:&nbsp;</td> <!-- minutes --> <td class=\"form-group\" [class.has-error]=\"invalidMinutes\"> <input type=\"text\" class=\"form-control text-center bs-timepicker-field\" placeholder=\"MM\" maxlength=\"2\" [readonly]=\"readonlyInput\" [value]=\"minutes\" (wheel)=\"prevDef($event);changeMinutes(minuteStep * wheelSign($event), 'wheel')\" (keydown.ArrowUp)=\"changeMinutes(minuteStep, 'key')\" (keydown.ArrowDown)=\"changeMinutes(-minuteStep, 'key')\" (change)=\"updateMinutes($event.target.value)\"> </td> <!-- divider --> <td *ngIf=\"showSeconds\">&nbsp;:&nbsp;</td> <!-- seconds --> <td class=\"form-group\" *ngIf=\"showSeconds\" [class.has-error]=\"invalidSeconds\"> <input type=\"text\" class=\"form-control text-center bs-timepicker-field\" placeholder=\"SS\" maxlength=\"2\" [readonly]=\"readonlyInput\" [value]=\"seconds\" (wheel)=\"prevDef($event);changeSeconds(secondsStep * wheelSign($event), 'wheel')\" (keydown.ArrowUp)=\"changeSeconds(secondsStep, 'key')\" (keydown.ArrowDown)=\"changeSeconds(-secondsStep, 'key')\" (change)=\"updateSeconds($event.target.value)\"> </td> <!-- space between --> <td>&nbsp;&nbsp;&nbsp;</td> <!-- meridian --> <td *ngIf=\"showMeridian\"> <button type=\"button\" class=\"btn btn-default text-center\" [disabled]=\"readonlyInput\" [class.disabled]=\"readonlyInput\" (click)=\"toggleMeridian()\" >{{ meridian }} </button> </td> </tr> <tr class=\"text-center\" [class.hidden]=\"!isSpinnersVisible\"> <!-- decrement hours button--> <td> <a class=\"btn btn-link\" [class.disabled]=\"!canDecrementHours\" (click)=\"changeHours(-hourStep)\"> <span class=\"bs-chevron bs-chevron-down\"></span> </a> </td> <!-- divider --> <td>&nbsp;&nbsp;&nbsp;</td> <!-- decrement minutes button--> <td> <a class=\"btn btn-link\" [class.disabled]=\"!canDecrementMinutes\" (click)=\"changeMinutes(-minuteStep)\"> <span class=\"bs-chevron bs-chevron-down\"></span> </a> </td> <!-- divider --> <td *ngIf=\"showSeconds\">&nbsp;</td> <!-- decrement seconds button--> <td *ngIf=\"showSeconds\"> <a class=\"btn btn-link\" [class.disabled]=\"!canDecrementSeconds\" (click)=\"changeSeconds(-secondsStep)\"> <span class=\"bs-chevron bs-chevron-down\"></span> </a> </td> <!-- space between --> <td>&nbsp;&nbsp;&nbsp;</td> <!-- meridian placeholder--> <td *ngIf=\"showMeridian\"></td> </tr> </tbody> </table> ",
                    styles: ["\n    .bs-chevron{\n      border-style: solid;\n      display: block;\n      width: 9px;\n      height: 9px;\n      position: relative;\n      border-width: 3px 0px 0 3px;\n    }\n    .bs-chevron-up{\n      -webkit-transform: rotate(45deg);\n      transform: rotate(45deg);\n      top: 2px;\n    }\n    .bs-chevron-down{\n      -webkit-transform: rotate(-135deg);\n      transform: rotate(-135deg);\n      top: -2px;\n    }\n    .bs-timepicker-field{\n      width: 50px;\n    }\n  "],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    TimepickerComponent.ctorParameters = function () { return [
        { type: TimepickerConfig, },
        { type: ChangeDetectorRef, },
        { type: TimepickerStore, },
        { type: TimepickerActions, },
    ]; };
    TimepickerComponent.propDecorators = {
        'hourStep': [{ type: Input },],
        'minuteStep': [{ type: Input },],
        'secondsStep': [{ type: Input },],
        'readonlyInput': [{ type: Input },],
        'mousewheel': [{ type: Input },],
        'arrowkeys': [{ type: Input },],
        'showSpinners': [{ type: Input },],
        'showMeridian': [{ type: Input },],
        'showSeconds': [{ type: Input },],
        'meridians': [{ type: Input },],
        'min': [{ type: Input },],
        'max': [{ type: Input },],
        'isValid': [{ type: Output },],
    };
    return TimepickerComponent;
}());

/** Default values provider for tooltip */
var TooltipConfig = (function () {
    function TooltipConfig() {
        /** tooltip placement, supported positions: 'top', 'bottom', 'left', 'right' */
        this.placement = 'top';
        /** array of event names which triggers tooltip opening */
        this.triggers = 'hover focus';
    }
    TooltipConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TooltipConfig.ctorParameters = function () { return []; };
    return TooltipConfig;
}());

var TooltipContainerComponent = (function () {
    function TooltipContainerComponent(config) {
        Object.assign(this, config);
    }
    Object.defineProperty(TooltipContainerComponent.prototype, "isBs3", {
        get: function () {
            return isBs3();
        },
        enumerable: true,
        configurable: true
    });
    TooltipContainerComponent.prototype.ngAfterViewInit = function () {
        this.classMap = { in: false, fade: false };
        this.classMap[this.placement] = true;
        this.classMap["tooltip-" + this.placement] = true;
        this.classMap.in = true;
        if (this.animation) {
            this.classMap.fade = true;
        }
        if (this.containerClass) {
            this.classMap[this.containerClass] = true;
        }
    };
    TooltipContainerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'bs-tooltip-container',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    // tslint:disable-next-line
                    host: {
                        '[class]': '"tooltip in tooltip-" + placement + " " + "bs-tooltip-" + placement + " " + placement + " " + containerClass',
                        '[class.show]': '!isBs3',
                        role: 'tooltip'
                    },
                    styles: [
                        "\n    :host.tooltip {\n      display: block;\n    }\n    :host.bs-tooltip-top .arrow, :host.bs-tooltip-bottom .arrow {\n      left: calc(50% - 2.5px);\n    }\n    :host.bs-tooltip-left .arrow, :host.bs-tooltip-right .arrow {\n      top: calc(50% - 2.5px);\n    }\n  "
                    ],
                    template: "\n    <div class=\"tooltip-arrow arrow\"></div>\n    <div class=\"tooltip-inner\"><ng-content></ng-content></div>\n    "
                },] },
    ];
    /** @nocollapse */
    TooltipContainerComponent.ctorParameters = function () { return [
        { type: TooltipConfig, },
    ]; };
    return TooltipContainerComponent;
}());

var __decorate$1 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$1 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// tslint:disable:deprecation
var TooltipDirective = (function () {
    function TooltipDirective(_viewContainerRef, _renderer, _elementRef, cis, config) {
        /** Fired when tooltip content changes */
        this.tooltipChange = new EventEmitter();
        /**
         * Css class for tooltip container
         */
        this.containerClass = '';
        /** @deprecated - removed, will be added to configuration */
        this._animation = true;
        /** @deprecated */
        this._delay = 0;
        /** @deprecated */
        this._fadeDuration = 150;
        /** @deprecated */
        this.tooltipStateChanged = new EventEmitter();
        this._tooltip = cis
            .createLoader(_elementRef, _viewContainerRef, _renderer)
            .provide({ provide: TooltipConfig, useValue: config });
        Object.assign(this, config);
        this.onShown = this._tooltip.onShown;
        this.onHidden = this._tooltip.onHidden;
    }
    Object.defineProperty(TooltipDirective.prototype, "isOpen", {
        /**
         * Returns whether or not the tooltip is currently being shown
         */
        get: function () {
            return this._tooltip.isShown;
        },
        set: function (value) {
            if (value) {
                this.show();
            }
            else {
                this.hide();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "htmlContent", {
        /** @deprecated - please use `tooltip` instead */
        set: function (value) {
            warnOnce('tooltipHtml was deprecated, please use `tooltip` instead');
            this.tooltip = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "_placement", {
        /** @deprecated - please use `placement` instead */
        set: function (value) {
            warnOnce('tooltipPlacement was deprecated, please use `placement` instead');
            this.placement = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "_isOpen", {
        get: function () {
            warnOnce('tooltipIsOpen was deprecated, please use `isOpen` instead');
            return this.isOpen;
        },
        /** @deprecated - please use `isOpen` instead*/
        set: function (value) {
            warnOnce('tooltipIsOpen was deprecated, please use `isOpen` instead');
            this.isOpen = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "_enable", {
        get: function () {
            warnOnce('tooltipEnable was deprecated, please use `isDisabled` instead');
            return this.isDisabled;
        },
        /** @deprecated - please use `isDisabled` instead */
        set: function (value) {
            warnOnce('tooltipEnable was deprecated, please use `isDisabled` instead');
            this.isDisabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "_appendToBody", {
        get: function () {
            warnOnce('tooltipAppendToBody was deprecated, please use `container="body"` instead');
            return this.container === 'body';
        },
        /** @deprecated - please use `container="body"` instead */
        set: function (value) {
            warnOnce('tooltipAppendToBody was deprecated, please use `container="body"` instead');
            this.container = value ? 'body' : this.container;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "_popupClass", {
        /** @deprecated - will replaced with customClass */
        set: function (value) {
            warnOnce('tooltipClass deprecated');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "_tooltipContext", {
        /** @deprecated - removed */
        set: function (value) {
            warnOnce('tooltipContext deprecated');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipDirective.prototype, "_tooltipTrigger", {
        /** @deprecated -  please use `triggers` instead */
        get: function () {
            warnOnce('tooltipTrigger was deprecated, please use `triggers` instead');
            return this.triggers;
        },
        set: function (value) {
            warnOnce('tooltipTrigger was deprecated, please use `triggers` instead');
            this.triggers = (value || '').toString();
        },
        enumerable: true,
        configurable: true
    });
    TooltipDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._tooltip.listen({
            triggers: this.triggers,
            show: function () { return _this.show(); }
        });
        this.tooltipChange.subscribe(function (value) {
            if (!value) {
                _this._tooltip.hide();
            }
        });
    };
    /**
     * Toggles an element’s tooltip. This is considered a “manual” triggering of
     * the tooltip.
     */
    TooltipDirective.prototype.toggle = function () {
        if (this.isOpen) {
            return this.hide();
        }
        this.show();
    };
    /**
     * Opens an element’s tooltip. This is considered a “manual” triggering of
     * the tooltip.
     */
    TooltipDirective.prototype.show = function () {
        var _this = this;
        if (this.isOpen ||
            this.isDisabled ||
            this._delayTimeoutId ||
            !this.tooltip) {
            return;
        }
        var showTooltip = function () {
            if (_this._delayTimeoutId) {
                _this._delayTimeoutId = undefined;
            }
            _this._tooltip
                .attach(TooltipContainerComponent)
                .to(_this.container)
                .position({ attachment: _this.placement })
                .show({
                content: _this.tooltip,
                placement: _this.placement,
                containerClass: _this.containerClass
            });
        };
        if (this._delay) {
            this._delayTimeoutId = setTimeout(function () {
                showTooltip();
            }, this._delay);
        }
        else {
            showTooltip();
        }
    };
    /**
     * Closes an element’s tooltip. This is considered a “manual” triggering of
     * the tooltip.
     */
    TooltipDirective.prototype.hide = function () {
        var _this = this;
        if (this._delayTimeoutId) {
            clearTimeout(this._delayTimeoutId);
            this._delayTimeoutId = undefined;
        }
        if (!this._tooltip.isShown) {
            return;
        }
        this._tooltip.instance.classMap.in = false;
        setTimeout(function () {
            _this._tooltip.hide();
        }, this._fadeDuration);
    };
    TooltipDirective.prototype.ngOnDestroy = function () {
        this._tooltip.dispose();
    };
    TooltipDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[tooltip], [tooltipHtml]',
                    exportAs: 'bs-tooltip'
                },] },
    ];
    /** @nocollapse */
    TooltipDirective.ctorParameters = function () { return [
        { type: ViewContainerRef, },
        { type: Renderer2, },
        { type: ElementRef, },
        { type: ComponentLoaderFactory, },
        { type: TooltipConfig, },
    ]; };
    TooltipDirective.propDecorators = {
        'tooltip': [{ type: Input },],
        'tooltipChange': [{ type: Output },],
        'placement': [{ type: Input },],
        'triggers': [{ type: Input },],
        'container': [{ type: Input },],
        'isOpen': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'containerClass': [{ type: Input },],
        'onShown': [{ type: Output },],
        'onHidden': [{ type: Output },],
        'htmlContent': [{ type: Input, args: ['tooltipHtml',] },],
        '_placement': [{ type: Input, args: ['tooltipPlacement',] },],
        '_isOpen': [{ type: Input, args: ['tooltipIsOpen',] },],
        '_enable': [{ type: Input, args: ['tooltipEnable',] },],
        '_appendToBody': [{ type: Input, args: ['tooltipAppendToBody',] },],
        '_animation': [{ type: Input, args: ['tooltipAnimation',] },],
        '_popupClass': [{ type: Input, args: ['tooltipClass',] },],
        '_tooltipContext': [{ type: Input, args: ['tooltipContext',] },],
        '_delay': [{ type: Input, args: ['tooltipPopupDelay',] },],
        '_fadeDuration': [{ type: Input, args: ['tooltipFadeDuration',] },],
        '_tooltipTrigger': [{ type: Input, args: ['tooltipTrigger',] },],
        'tooltipStateChanged': [{ type: Output },],
    };
    __decorate$1([
        OnChange(),
        __metadata$1("design:type", Object)
    ], TooltipDirective.prototype, "tooltip", void 0);
    return TooltipDirective;
}());

var TooltipModule = (function () {
    function TooltipModule() {
    }
    TooltipModule.forRoot = function () {
        return {
            ngModule: TooltipModule,
            providers: [TooltipConfig, ComponentLoaderFactory, PositioningService]
        };
    };
    TooltipModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: [TooltipDirective, TooltipContainerComponent],
                    exports: [TooltipDirective],
                    entryComponents: [TooltipContainerComponent]
                },] },
    ];
    /** @nocollapse */
    TooltipModule.ctorParameters = function () { return []; };
    return TooltipModule;
}());

/* tslint:disable:max-file-line-count */
var latinMap = {
    Á: 'A',
    Ă: 'A',
    Ắ: 'A',
    Ặ: 'A',
    Ằ: 'A',
    Ẳ: 'A',
    Ẵ: 'A',
    Ǎ: 'A',
    Â: 'A',
    Ấ: 'A',
    Ậ: 'A',
    Ầ: 'A',
    Ẩ: 'A',
    Ẫ: 'A',
    Ä: 'A',
    Ǟ: 'A',
    Ȧ: 'A',
    Ǡ: 'A',
    Ạ: 'A',
    Ȁ: 'A',
    À: 'A',
    Ả: 'A',
    Ȃ: 'A',
    Ā: 'A',
    Ą: 'A',
    Å: 'A',
    Ǻ: 'A',
    Ḁ: 'A',
    Ⱥ: 'A',
    Ã: 'A',
    Ꜳ: 'AA',
    Æ: 'AE',
    Ǽ: 'AE',
    Ǣ: 'AE',
    Ꜵ: 'AO',
    Ꜷ: 'AU',
    Ꜹ: 'AV',
    Ꜻ: 'AV',
    Ꜽ: 'AY',
    Ḃ: 'B',
    Ḅ: 'B',
    Ɓ: 'B',
    Ḇ: 'B',
    Ƀ: 'B',
    Ƃ: 'B',
    Ć: 'C',
    Č: 'C',
    Ç: 'C',
    Ḉ: 'C',
    Ĉ: 'C',
    Ċ: 'C',
    Ƈ: 'C',
    Ȼ: 'C',
    Ď: 'D',
    Ḑ: 'D',
    Ḓ: 'D',
    Ḋ: 'D',
    Ḍ: 'D',
    Ɗ: 'D',
    Ḏ: 'D',
    ǲ: 'D',
    ǅ: 'D',
    Đ: 'D',
    Ƌ: 'D',
    Ǳ: 'DZ',
    Ǆ: 'DZ',
    É: 'E',
    Ĕ: 'E',
    Ě: 'E',
    Ȩ: 'E',
    Ḝ: 'E',
    Ê: 'E',
    Ế: 'E',
    Ệ: 'E',
    Ề: 'E',
    Ể: 'E',
    Ễ: 'E',
    Ḙ: 'E',
    Ë: 'E',
    Ė: 'E',
    Ẹ: 'E',
    Ȅ: 'E',
    È: 'E',
    Ẻ: 'E',
    Ȇ: 'E',
    Ē: 'E',
    Ḗ: 'E',
    Ḕ: 'E',
    Ę: 'E',
    Ɇ: 'E',
    Ẽ: 'E',
    Ḛ: 'E',
    Ꝫ: 'ET',
    Ḟ: 'F',
    Ƒ: 'F',
    Ǵ: 'G',
    Ğ: 'G',
    Ǧ: 'G',
    Ģ: 'G',
    Ĝ: 'G',
    Ġ: 'G',
    Ɠ: 'G',
    Ḡ: 'G',
    Ǥ: 'G',
    Ḫ: 'H',
    Ȟ: 'H',
    Ḩ: 'H',
    Ĥ: 'H',
    Ⱨ: 'H',
    Ḧ: 'H',
    Ḣ: 'H',
    Ḥ: 'H',
    Ħ: 'H',
    Í: 'I',
    Ĭ: 'I',
    Ǐ: 'I',
    Î: 'I',
    Ï: 'I',
    Ḯ: 'I',
    İ: 'I',
    Ị: 'I',
    Ȉ: 'I',
    Ì: 'I',
    Ỉ: 'I',
    Ȋ: 'I',
    Ī: 'I',
    Į: 'I',
    Ɨ: 'I',
    Ĩ: 'I',
    Ḭ: 'I',
    Ꝺ: 'D',
    Ꝼ: 'F',
    Ᵹ: 'G',
    Ꞃ: 'R',
    Ꞅ: 'S',
    Ꞇ: 'T',
    Ꝭ: 'IS',
    Ĵ: 'J',
    Ɉ: 'J',
    Ḱ: 'K',
    Ǩ: 'K',
    Ķ: 'K',
    Ⱪ: 'K',
    Ꝃ: 'K',
    Ḳ: 'K',
    Ƙ: 'K',
    Ḵ: 'K',
    Ꝁ: 'K',
    Ꝅ: 'K',
    Ĺ: 'L',
    Ƚ: 'L',
    Ľ: 'L',
    Ļ: 'L',
    Ḽ: 'L',
    Ḷ: 'L',
    Ḹ: 'L',
    Ⱡ: 'L',
    Ꝉ: 'L',
    Ḻ: 'L',
    Ŀ: 'L',
    Ɫ: 'L',
    ǈ: 'L',
    Ł: 'L',
    Ǉ: 'LJ',
    Ḿ: 'M',
    Ṁ: 'M',
    Ṃ: 'M',
    Ɱ: 'M',
    Ń: 'N',
    Ň: 'N',
    Ņ: 'N',
    Ṋ: 'N',
    Ṅ: 'N',
    Ṇ: 'N',
    Ǹ: 'N',
    Ɲ: 'N',
    Ṉ: 'N',
    Ƞ: 'N',
    ǋ: 'N',
    Ñ: 'N',
    Ǌ: 'NJ',
    Ó: 'O',
    Ŏ: 'O',
    Ǒ: 'O',
    Ô: 'O',
    Ố: 'O',
    Ộ: 'O',
    Ồ: 'O',
    Ổ: 'O',
    Ỗ: 'O',
    Ö: 'O',
    Ȫ: 'O',
    Ȯ: 'O',
    Ȱ: 'O',
    Ọ: 'O',
    Ő: 'O',
    Ȍ: 'O',
    Ò: 'O',
    Ỏ: 'O',
    Ơ: 'O',
    Ớ: 'O',
    Ợ: 'O',
    Ờ: 'O',
    Ở: 'O',
    Ỡ: 'O',
    Ȏ: 'O',
    Ꝋ: 'O',
    Ꝍ: 'O',
    Ō: 'O',
    Ṓ: 'O',
    Ṑ: 'O',
    Ɵ: 'O',
    Ǫ: 'O',
    Ǭ: 'O',
    Ø: 'O',
    Ǿ: 'O',
    Õ: 'O',
    Ṍ: 'O',
    Ṏ: 'O',
    Ȭ: 'O',
    Ƣ: 'OI',
    Ꝏ: 'OO',
    Ɛ: 'E',
    Ɔ: 'O',
    Ȣ: 'OU',
    Ṕ: 'P',
    Ṗ: 'P',
    Ꝓ: 'P',
    Ƥ: 'P',
    Ꝕ: 'P',
    Ᵽ: 'P',
    Ꝑ: 'P',
    Ꝙ: 'Q',
    Ꝗ: 'Q',
    Ŕ: 'R',
    Ř: 'R',
    Ŗ: 'R',
    Ṙ: 'R',
    Ṛ: 'R',
    Ṝ: 'R',
    Ȑ: 'R',
    Ȓ: 'R',
    Ṟ: 'R',
    Ɍ: 'R',
    Ɽ: 'R',
    Ꜿ: 'C',
    Ǝ: 'E',
    Ś: 'S',
    Ṥ: 'S',
    Š: 'S',
    Ṧ: 'S',
    Ş: 'S',
    Ŝ: 'S',
    Ș: 'S',
    Ṡ: 'S',
    Ṣ: 'S',
    Ṩ: 'S',
    Ť: 'T',
    Ţ: 'T',
    Ṱ: 'T',
    Ț: 'T',
    Ⱦ: 'T',
    Ṫ: 'T',
    Ṭ: 'T',
    Ƭ: 'T',
    Ṯ: 'T',
    Ʈ: 'T',
    Ŧ: 'T',
    Ɐ: 'A',
    Ꞁ: 'L',
    Ɯ: 'M',
    Ʌ: 'V',
    Ꜩ: 'TZ',
    Ú: 'U',
    Ŭ: 'U',
    Ǔ: 'U',
    Û: 'U',
    Ṷ: 'U',
    Ü: 'U',
    Ǘ: 'U',
    Ǚ: 'U',
    Ǜ: 'U',
    Ǖ: 'U',
    Ṳ: 'U',
    Ụ: 'U',
    Ű: 'U',
    Ȕ: 'U',
    Ù: 'U',
    Ủ: 'U',
    Ư: 'U',
    Ứ: 'U',
    Ự: 'U',
    Ừ: 'U',
    Ử: 'U',
    Ữ: 'U',
    Ȗ: 'U',
    Ū: 'U',
    Ṻ: 'U',
    Ų: 'U',
    Ů: 'U',
    Ũ: 'U',
    Ṹ: 'U',
    Ṵ: 'U',
    Ꝟ: 'V',
    Ṿ: 'V',
    Ʋ: 'V',
    Ṽ: 'V',
    Ꝡ: 'VY',
    Ẃ: 'W',
    Ŵ: 'W',
    Ẅ: 'W',
    Ẇ: 'W',
    Ẉ: 'W',
    Ẁ: 'W',
    Ⱳ: 'W',
    Ẍ: 'X',
    Ẋ: 'X',
    Ý: 'Y',
    Ŷ: 'Y',
    Ÿ: 'Y',
    Ẏ: 'Y',
    Ỵ: 'Y',
    Ỳ: 'Y',
    Ƴ: 'Y',
    Ỷ: 'Y',
    Ỿ: 'Y',
    Ȳ: 'Y',
    Ɏ: 'Y',
    Ỹ: 'Y',
    Ź: 'Z',
    Ž: 'Z',
    Ẑ: 'Z',
    Ⱬ: 'Z',
    Ż: 'Z',
    Ẓ: 'Z',
    Ȥ: 'Z',
    Ẕ: 'Z',
    Ƶ: 'Z',
    Ĳ: 'IJ',
    Œ: 'OE',
    ᴀ: 'A',
    ᴁ: 'AE',
    ʙ: 'B',
    ᴃ: 'B',
    ᴄ: 'C',
    ᴅ: 'D',
    ᴇ: 'E',
    ꜰ: 'F',
    ɢ: 'G',
    ʛ: 'G',
    ʜ: 'H',
    ɪ: 'I',
    ʁ: 'R',
    ᴊ: 'J',
    ᴋ: 'K',
    ʟ: 'L',
    ᴌ: 'L',
    ᴍ: 'M',
    ɴ: 'N',
    ᴏ: 'O',
    ɶ: 'OE',
    ᴐ: 'O',
    ᴕ: 'OU',
    ᴘ: 'P',
    ʀ: 'R',
    ᴎ: 'N',
    ᴙ: 'R',
    ꜱ: 'S',
    ᴛ: 'T',
    ⱻ: 'E',
    ᴚ: 'R',
    ᴜ: 'U',
    ᴠ: 'V',
    ᴡ: 'W',
    ʏ: 'Y',
    ᴢ: 'Z',
    á: 'a',
    ă: 'a',
    ắ: 'a',
    ặ: 'a',
    ằ: 'a',
    ẳ: 'a',
    ẵ: 'a',
    ǎ: 'a',
    â: 'a',
    ấ: 'a',
    ậ: 'a',
    ầ: 'a',
    ẩ: 'a',
    ẫ: 'a',
    ä: 'a',
    ǟ: 'a',
    ȧ: 'a',
    ǡ: 'a',
    ạ: 'a',
    ȁ: 'a',
    à: 'a',
    ả: 'a',
    ȃ: 'a',
    ā: 'a',
    ą: 'a',
    ᶏ: 'a',
    ẚ: 'a',
    å: 'a',
    ǻ: 'a',
    ḁ: 'a',
    ⱥ: 'a',
    ã: 'a',
    ꜳ: 'aa',
    æ: 'ae',
    ǽ: 'ae',
    ǣ: 'ae',
    ꜵ: 'ao',
    ꜷ: 'au',
    ꜹ: 'av',
    ꜻ: 'av',
    ꜽ: 'ay',
    ḃ: 'b',
    ḅ: 'b',
    ɓ: 'b',
    ḇ: 'b',
    ᵬ: 'b',
    ᶀ: 'b',
    ƀ: 'b',
    ƃ: 'b',
    ɵ: 'o',
    ć: 'c',
    č: 'c',
    ç: 'c',
    ḉ: 'c',
    ĉ: 'c',
    ɕ: 'c',
    ċ: 'c',
    ƈ: 'c',
    ȼ: 'c',
    ď: 'd',
    ḑ: 'd',
    ḓ: 'd',
    ȡ: 'd',
    ḋ: 'd',
    ḍ: 'd',
    ɗ: 'd',
    ᶑ: 'd',
    ḏ: 'd',
    ᵭ: 'd',
    ᶁ: 'd',
    đ: 'd',
    ɖ: 'd',
    ƌ: 'd',
    ı: 'i',
    ȷ: 'j',
    ɟ: 'j',
    ʄ: 'j',
    ǳ: 'dz',
    ǆ: 'dz',
    é: 'e',
    ĕ: 'e',
    ě: 'e',
    ȩ: 'e',
    ḝ: 'e',
    ê: 'e',
    ế: 'e',
    ệ: 'e',
    ề: 'e',
    ể: 'e',
    ễ: 'e',
    ḙ: 'e',
    ë: 'e',
    ė: 'e',
    ẹ: 'e',
    ȅ: 'e',
    è: 'e',
    ẻ: 'e',
    ȇ: 'e',
    ē: 'e',
    ḗ: 'e',
    ḕ: 'e',
    ⱸ: 'e',
    ę: 'e',
    ᶒ: 'e',
    ɇ: 'e',
    ẽ: 'e',
    ḛ: 'e',
    ꝫ: 'et',
    ḟ: 'f',
    ƒ: 'f',
    ᵮ: 'f',
    ᶂ: 'f',
    ǵ: 'g',
    ğ: 'g',
    ǧ: 'g',
    ģ: 'g',
    ĝ: 'g',
    ġ: 'g',
    ɠ: 'g',
    ḡ: 'g',
    ᶃ: 'g',
    ǥ: 'g',
    ḫ: 'h',
    ȟ: 'h',
    ḩ: 'h',
    ĥ: 'h',
    ⱨ: 'h',
    ḧ: 'h',
    ḣ: 'h',
    ḥ: 'h',
    ɦ: 'h',
    ẖ: 'h',
    ħ: 'h',
    ƕ: 'hv',
    í: 'i',
    ĭ: 'i',
    ǐ: 'i',
    î: 'i',
    ï: 'i',
    ḯ: 'i',
    ị: 'i',
    ȉ: 'i',
    ì: 'i',
    ỉ: 'i',
    ȋ: 'i',
    ī: 'i',
    į: 'i',
    ᶖ: 'i',
    ɨ: 'i',
    ĩ: 'i',
    ḭ: 'i',
    ꝺ: 'd',
    ꝼ: 'f',
    ᵹ: 'g',
    ꞃ: 'r',
    ꞅ: 's',
    ꞇ: 't',
    ꝭ: 'is',
    ǰ: 'j',
    ĵ: 'j',
    ʝ: 'j',
    ɉ: 'j',
    ḱ: 'k',
    ǩ: 'k',
    ķ: 'k',
    ⱪ: 'k',
    ꝃ: 'k',
    ḳ: 'k',
    ƙ: 'k',
    ḵ: 'k',
    ᶄ: 'k',
    ꝁ: 'k',
    ꝅ: 'k',
    ĺ: 'l',
    ƚ: 'l',
    ɬ: 'l',
    ľ: 'l',
    ļ: 'l',
    ḽ: 'l',
    ȴ: 'l',
    ḷ: 'l',
    ḹ: 'l',
    ⱡ: 'l',
    ꝉ: 'l',
    ḻ: 'l',
    ŀ: 'l',
    ɫ: 'l',
    ᶅ: 'l',
    ɭ: 'l',
    ł: 'l',
    ǉ: 'lj',
    ſ: 's',
    ẜ: 's',
    ẛ: 's',
    ẝ: 's',
    ḿ: 'm',
    ṁ: 'm',
    ṃ: 'm',
    ɱ: 'm',
    ᵯ: 'm',
    ᶆ: 'm',
    ń: 'n',
    ň: 'n',
    ņ: 'n',
    ṋ: 'n',
    ȵ: 'n',
    ṅ: 'n',
    ṇ: 'n',
    ǹ: 'n',
    ɲ: 'n',
    ṉ: 'n',
    ƞ: 'n',
    ᵰ: 'n',
    ᶇ: 'n',
    ɳ: 'n',
    ñ: 'n',
    ǌ: 'nj',
    ó: 'o',
    ŏ: 'o',
    ǒ: 'o',
    ô: 'o',
    ố: 'o',
    ộ: 'o',
    ồ: 'o',
    ổ: 'o',
    ỗ: 'o',
    ö: 'o',
    ȫ: 'o',
    ȯ: 'o',
    ȱ: 'o',
    ọ: 'o',
    ő: 'o',
    ȍ: 'o',
    ò: 'o',
    ỏ: 'o',
    ơ: 'o',
    ớ: 'o',
    ợ: 'o',
    ờ: 'o',
    ở: 'o',
    ỡ: 'o',
    ȏ: 'o',
    ꝋ: 'o',
    ꝍ: 'o',
    ⱺ: 'o',
    ō: 'o',
    ṓ: 'o',
    ṑ: 'o',
    ǫ: 'o',
    ǭ: 'o',
    ø: 'o',
    ǿ: 'o',
    õ: 'o',
    ṍ: 'o',
    ṏ: 'o',
    ȭ: 'o',
    ƣ: 'oi',
    ꝏ: 'oo',
    ɛ: 'e',
    ᶓ: 'e',
    ɔ: 'o',
    ᶗ: 'o',
    ȣ: 'ou',
    ṕ: 'p',
    ṗ: 'p',
    ꝓ: 'p',
    ƥ: 'p',
    ᵱ: 'p',
    ᶈ: 'p',
    ꝕ: 'p',
    ᵽ: 'p',
    ꝑ: 'p',
    ꝙ: 'q',
    ʠ: 'q',
    ɋ: 'q',
    ꝗ: 'q',
    ŕ: 'r',
    ř: 'r',
    ŗ: 'r',
    ṙ: 'r',
    ṛ: 'r',
    ṝ: 'r',
    ȑ: 'r',
    ɾ: 'r',
    ᵳ: 'r',
    ȓ: 'r',
    ṟ: 'r',
    ɼ: 'r',
    ᵲ: 'r',
    ᶉ: 'r',
    ɍ: 'r',
    ɽ: 'r',
    ↄ: 'c',
    ꜿ: 'c',
    ɘ: 'e',
    ɿ: 'r',
    ś: 's',
    ṥ: 's',
    š: 's',
    ṧ: 's',
    ş: 's',
    ŝ: 's',
    ș: 's',
    ṡ: 's',
    ṣ: 's',
    ṩ: 's',
    ʂ: 's',
    ᵴ: 's',
    ᶊ: 's',
    ȿ: 's',
    ɡ: 'g',
    ᴑ: 'o',
    ᴓ: 'o',
    ᴝ: 'u',
    ť: 't',
    ţ: 't',
    ṱ: 't',
    ț: 't',
    ȶ: 't',
    ẗ: 't',
    ⱦ: 't',
    ṫ: 't',
    ṭ: 't',
    ƭ: 't',
    ṯ: 't',
    ᵵ: 't',
    ƫ: 't',
    ʈ: 't',
    ŧ: 't',
    ᵺ: 'th',
    ɐ: 'a',
    ᴂ: 'ae',
    ǝ: 'e',
    ᵷ: 'g',
    ɥ: 'h',
    ʮ: 'h',
    ʯ: 'h',
    ᴉ: 'i',
    ʞ: 'k',
    ꞁ: 'l',
    ɯ: 'm',
    ɰ: 'm',
    ᴔ: 'oe',
    ɹ: 'r',
    ɻ: 'r',
    ɺ: 'r',
    ⱹ: 'r',
    ʇ: 't',
    ʌ: 'v',
    ʍ: 'w',
    ʎ: 'y',
    ꜩ: 'tz',
    ú: 'u',
    ŭ: 'u',
    ǔ: 'u',
    û: 'u',
    ṷ: 'u',
    ü: 'u',
    ǘ: 'u',
    ǚ: 'u',
    ǜ: 'u',
    ǖ: 'u',
    ṳ: 'u',
    ụ: 'u',
    ű: 'u',
    ȕ: 'u',
    ù: 'u',
    ủ: 'u',
    ư: 'u',
    ứ: 'u',
    ự: 'u',
    ừ: 'u',
    ử: 'u',
    ữ: 'u',
    ȗ: 'u',
    ū: 'u',
    ṻ: 'u',
    ų: 'u',
    ᶙ: 'u',
    ů: 'u',
    ũ: 'u',
    ṹ: 'u',
    ṵ: 'u',
    ᵫ: 'ue',
    ꝸ: 'um',
    ⱴ: 'v',
    ꝟ: 'v',
    ṿ: 'v',
    ʋ: 'v',
    ᶌ: 'v',
    ⱱ: 'v',
    ṽ: 'v',
    ꝡ: 'vy',
    ẃ: 'w',
    ŵ: 'w',
    ẅ: 'w',
    ẇ: 'w',
    ẉ: 'w',
    ẁ: 'w',
    ⱳ: 'w',
    ẘ: 'w',
    ẍ: 'x',
    ẋ: 'x',
    ᶍ: 'x',
    ý: 'y',
    ŷ: 'y',
    ÿ: 'y',
    ẏ: 'y',
    ỵ: 'y',
    ỳ: 'y',
    ƴ: 'y',
    ỷ: 'y',
    ỿ: 'y',
    ȳ: 'y',
    ẙ: 'y',
    ɏ: 'y',
    ỹ: 'y',
    ź: 'z',
    ž: 'z',
    ẑ: 'z',
    ʑ: 'z',
    ⱬ: 'z',
    ż: 'z',
    ẓ: 'z',
    ȥ: 'z',
    ẕ: 'z',
    ᵶ: 'z',
    ᶎ: 'z',
    ʐ: 'z',
    ƶ: 'z',
    ɀ: 'z',
    ﬀ: 'ff',
    ﬃ: 'ffi',
    ﬄ: 'ffl',
    ﬁ: 'fi',
    ﬂ: 'fl',
    ĳ: 'ij',
    œ: 'oe',
    ﬆ: 'st',
    ₐ: 'a',
    ₑ: 'e',
    ᵢ: 'i',
    ⱼ: 'j',
    ₒ: 'o',
    ᵣ: 'r',
    ᵤ: 'u',
    ᵥ: 'v',
    ₓ: 'x'
};

var TypeaheadMatch = (function () {
    function TypeaheadMatch(item, value, header) {
        if (value === void 0) { value = item; }
        if (header === void 0) { header = false; }
        this.item = item;
        this.value = value;
        this.header = header;
    }
    TypeaheadMatch.prototype.isHeader = function () {
        return this.header;
    };
    TypeaheadMatch.prototype.toString = function () {
        return this.value;
    };
    return TypeaheadMatch;
}());

function latinize(str) {
    if (!str) {
        return '';
    }
    return str.replace(/[^A-Za-z0-9\[\] ]/g, function (a) {
        return latinMap[a] || a;
    });
}

/* tslint:disable */
function tokenize(str, wordRegexDelimiters, phraseRegexDelimiters) {
    if (wordRegexDelimiters === void 0) { wordRegexDelimiters = ' '; }
    if (phraseRegexDelimiters === void 0) { phraseRegexDelimiters = ''; }
    /* tslint:enable */
    var regexStr = "(?:[" + phraseRegexDelimiters + "])([^" + phraseRegexDelimiters + "]+)" +
        ("(?:[" + phraseRegexDelimiters + "])|([^" + wordRegexDelimiters + "]+)");
    var preTokenized = str.split(new RegExp(regexStr, 'g'));
    var result = [];
    var preTokenizedLength = preTokenized.length;
    var token;
    var replacePhraseDelimiters = new RegExp("[" + phraseRegexDelimiters + "]+", 'g');
    for (var i = 0; i < preTokenizedLength; i += 1) {
        token = preTokenized[i];
        if (token && token.length && token !== wordRegexDelimiters) {
            result.push(token.replace(replacePhraseDelimiters, ''));
        }
    }
    return result;
}
function getValueFromObject(object, option) {
    if (!option || typeof object !== 'object') {
        return object.toString();
    }
    if (option.endsWith('()')) {
        var functionName = option.slice(0, option.length - 2);
        return object[functionName]().toString();
    }
    var properties = option
        .replace(/\[(\w+)\]/g, '.$1')
        .replace(/^\./, '');
    var propertiesArray = properties.split('.');
    for (var _i = 0, propertiesArray_1 = propertiesArray; _i < propertiesArray_1.length; _i++) {
        var property = propertiesArray_1[_i];
        if (property in object) {
            // tslint:disable-next-line
            object = object[property];
        }
    }
    if (!object) {
        return '';
    }
    return object.toString();
}

var TypeaheadContainerComponent = (function () {
    function TypeaheadContainerComponent(element, renderer) {
        this.renderer = renderer;
        this.isFocused = false;
        this._matches = [];
        this.isScrolledIntoView = function (elem) {
            var containerViewTop = this.ulElement.nativeElement.scrollTop;
            var containerViewBottom = containerViewTop + this.ulElement.nativeElement.offsetHeight;
            var elemTop = elem.offsetTop;
            var elemBottom = elemTop + elem.offsetHeight;
            return ((elemBottom <= containerViewBottom) && (elemTop >= containerViewTop));
        };
        this.element = element;
    }
    Object.defineProperty(TypeaheadContainerComponent.prototype, "isBs4", {
        get: function () {
            return !isBs3();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeaheadContainerComponent.prototype, "active", {
        get: function () {
            return this._active;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeaheadContainerComponent.prototype, "matches", {
        get: function () {
            return this._matches;
        },
        set: function (value) {
            var _this = this;
            this._matches = value;
            this.needScrollbar = this.typeaheadScrollable && this.typeaheadOptionsInScrollableView < this.matches.length;
            if (this.typeaheadScrollable) {
                setTimeout(function () {
                    _this.setScrollableMode();
                });
            }
            if (this._matches.length > 0) {
                this._active = this._matches[0];
                if (this._active.isHeader()) {
                    this.nextActiveMatch();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeaheadContainerComponent.prototype, "optionsListTemplate", {
        get: function () {
            return this.parent ? this.parent.optionsListTemplate : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeaheadContainerComponent.prototype, "typeaheadScrollable", {
        get: function () {
            return this.parent ? this.parent.typeaheadScrollable : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeaheadContainerComponent.prototype, "typeaheadOptionsInScrollableView", {
        get: function () {
            return this.parent ? this.parent.typeaheadOptionsInScrollableView : 5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeaheadContainerComponent.prototype, "itemTemplate", {
        get: function () {
            return this.parent ? this.parent.typeaheadItemTemplate : undefined;
        },
        enumerable: true,
        configurable: true
    });
    TypeaheadContainerComponent.prototype.selectActiveMatch = function () {
        this.selectMatch(this._active);
    };
    TypeaheadContainerComponent.prototype.prevActiveMatch = function () {
        var index = this.matches.indexOf(this._active);
        this._active = this.matches[index - 1 < 0 ? this.matches.length - 1 : index - 1];
        if (this._active.isHeader()) {
            this.prevActiveMatch();
        }
        if (this.typeaheadScrollable) {
            this.scrollPrevious(index);
        }
    };
    TypeaheadContainerComponent.prototype.nextActiveMatch = function () {
        var index = this.matches.indexOf(this._active);
        this._active = this.matches[index + 1 > this.matches.length - 1 ? 0 : index + 1];
        if (this._active.isHeader()) {
            this.nextActiveMatch();
        }
        if (this.typeaheadScrollable) {
            this.scrollNext(index);
        }
    };
    TypeaheadContainerComponent.prototype.selectActive = function (value) {
        this.isFocused = true;
        this._active = value;
    };
    TypeaheadContainerComponent.prototype.hightlight = function (match, query) {
        var itemStr = match.value;
        var itemStrHelper = (this.parent && this.parent.typeaheadLatinize
            ? latinize(itemStr)
            : itemStr).toLowerCase();
        var startIdx;
        var tokenLen;
        // Replaces the capture string with the same string inside of a "strong" tag
        if (typeof query === 'object') {
            var queryLen = query.length;
            for (var i = 0; i < queryLen; i += 1) {
                // query[i] is already latinized and lower case
                startIdx = itemStrHelper.indexOf(query[i]);
                tokenLen = query[i].length;
                if (startIdx >= 0 && tokenLen > 0) {
                    itemStr =
                        itemStr.substring(0, startIdx) + "<strong>" + itemStr.substring(startIdx, startIdx + tokenLen) + "</strong>" +
                            ("" + itemStr.substring(startIdx + tokenLen));
                    itemStrHelper =
                        itemStrHelper.substring(0, startIdx) + "        " + ' '.repeat(tokenLen) + "         " +
                            ("" + itemStrHelper.substring(startIdx + tokenLen));
                }
            }
        }
        else if (query) {
            // query is already latinized and lower case
            startIdx = itemStrHelper.indexOf(query);
            tokenLen = query.length;
            if (startIdx >= 0 && tokenLen > 0) {
                itemStr =
                    itemStr.substring(0, startIdx) + "<strong>" + itemStr.substring(startIdx, startIdx + tokenLen) + "</strong>" +
                        ("" + itemStr.substring(startIdx + tokenLen));
            }
        }
        return itemStr;
    };
    TypeaheadContainerComponent.prototype.focusLost = function () {
        this.isFocused = false;
    };
    TypeaheadContainerComponent.prototype.isActive = function (value) {
        return this._active === value;
    };
    TypeaheadContainerComponent.prototype.selectMatch = function (value, e) {
        var _this = this;
        if (e === void 0) { e = void 0; }
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.parent.changeModel(value);
        setTimeout(function () { return _this.parent.typeaheadOnSelect.emit(value); }, 0);
        return false;
    };
    TypeaheadContainerComponent.prototype.setScrollableMode = function () {
        if (!this.ulElement) {
            this.ulElement = this.element;
        }
        if (this.liElements.first) {
            var ulStyles = Utils.getStyles(this.ulElement.nativeElement);
            var liStyles = Utils.getStyles(this.liElements.first.nativeElement);
            var ulPaddingBottom = parseFloat((ulStyles['padding-bottom'] ? ulStyles['padding-bottom'] : '').replace('px', ''));
            var ulPaddingTop = parseFloat((ulStyles['padding-top'] ? ulStyles['padding-top'] : '0').replace('px', ''));
            var optionHeight = parseFloat((liStyles['height'] ? liStyles['height'] : '0').replace('px', ''));
            var height = this.typeaheadOptionsInScrollableView * optionHeight;
            this.guiHeight = (height + ulPaddingTop + ulPaddingBottom) + 'px';
        }
        this.renderer.setStyle(this.element.nativeElement, 'visibility', 'visible');
    };
    TypeaheadContainerComponent.prototype.scrollPrevious = function (index) {
        if (index === 0) {
            this.scrollToBottom();
            return;
        }
        if (this.liElements) {
            var liElement = this.liElements.toArray()[index - 1];
            if (liElement && !this.isScrolledIntoView(liElement.nativeElement)) {
                this.ulElement.nativeElement.scrollTop = liElement.nativeElement.offsetTop;
            }
        }
    };
    TypeaheadContainerComponent.prototype.scrollNext = function (index) {
        if (index + 1 > this.matches.length - 1) {
            this.scrollToTop();
            return;
        }
        if (this.liElements) {
            var liElement = this.liElements.toArray()[index + 1];
            if (liElement && !this.isScrolledIntoView(liElement.nativeElement)) {
                this.ulElement.nativeElement.scrollTop =
                    liElement.nativeElement.offsetTop -
                        this.ulElement.nativeElement.offsetHeight +
                        liElement.nativeElement.offsetHeight;
            }
        }
    };
    TypeaheadContainerComponent.prototype.scrollToBottom = function () {
        this.ulElement.nativeElement.scrollTop = this.ulElement.nativeElement.scrollHeight;
    };
    TypeaheadContainerComponent.prototype.scrollToTop = function () {
        this.ulElement.nativeElement.scrollTop = 0;
    };
    TypeaheadContainerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'typeahead-container',
                    // tslint:disable-next-line
                    template: "<!-- inject options list template --> <ng-template [ngTemplateOutlet]=\"optionsListTemplate || (isBs4 ? bs4Template : bs3Template)\" [ngTemplateOutletContext]=\"{matches:matches, itemTemplate:itemTemplate, query:query}\"></ng-template> <!-- default options item template --> <ng-template #bsItemTemplate let-match=\"match\" let-query=\"query\"><span [innerHtml]=\"hightlight(match, query)\"></span> </ng-template> <!-- Bootstrap 3 options list template --> <ng-template #bs3Template> <ul class=\"dropdown-menu\" #ulElement [style.overflow-y]=\"needScrollbar ? 'scroll': 'auto'\" [style.height]=\"needScrollbar ? guiHeight: 'auto'\"> <ng-template ngFor let-match let-i=\"index\" [ngForOf]=\"matches\"> <li #liElements *ngIf=\"match.isHeader()\" class=\"dropdown-header\">{{ match }}</li> <li #liElements *ngIf=\"!match.isHeader()\" [class.active]=\"isActive(match)\" (mouseenter)=\"selectActive(match)\"> <a href=\"#\" (click)=\"selectMatch(match, $event)\" tabindex=\"-1\"> <ng-template [ngTemplateOutlet]=\"itemTemplate || bsItemTemplate\" [ngTemplateOutletContext]=\"{item:match.item, index:i, match:match, query:query}\"></ng-template> </a> </li> </ng-template> </ul> </ng-template> <!-- Bootstrap 4 options list template --> <ng-template #bs4Template> <ng-template ngFor let-match let-i=\"index\" [ngForOf]=\"matches\"> <h6 *ngIf=\"match.isHeader()\" class=\"dropdown-header\">{{ match }}</h6> <ng-template [ngIf]=\"!match.isHeader()\"> <button #liElements class=\"dropdown-item\" (click)=\"selectMatch(match, $event)\" (mouseenter)=\"selectActive(match)\" [class.active]=\"isActive(match)\"> <ng-template [ngTemplateOutlet]=\"itemTemplate || bsItemTemplate\" [ngTemplateOutletContext]=\"{item:match.item, index:i, match:match, query:query}\"></ng-template> </button> </ng-template> </ng-template> </ng-template> ",
                    host: {
                        class: 'dropdown open',
                        '[class.dropdown-menu]': 'isBs4',
                        '[style.overflow-y]': "isBs4 && needScrollbar ? 'scroll': 'visible'",
                        '[style.height]': "isBs4 && needScrollbar ? guiHeight: 'auto'",
                        '[style.visibility]': "typeaheadScrollable ? 'hidden' : 'visible'",
                        '[class.dropup]': 'dropup',
                        style: 'position: absolute;display: block;'
                    }
                },] },
    ];
    /** @nocollapse */
    TypeaheadContainerComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Renderer2, },
    ]; };
    TypeaheadContainerComponent.propDecorators = {
        'ulElement': [{ type: ViewChild, args: ['ulElement',] },],
        'liElements': [{ type: ViewChildren, args: ['liElements',] },],
        'focusLost': [{ type: HostListener, args: ['mouseleave',] }, { type: HostListener, args: ['blur',] },],
    };
    return TypeaheadContainerComponent;
}());

/* tslint:disable:max-file-line-count */
var TypeaheadDirective = (function () {
    function TypeaheadDirective(ngControl, element, viewContainerRef, renderer, cis, changeDetection) {
        this.ngControl = ngControl;
        this.element = element;
        this.renderer = renderer;
        this.changeDetection = changeDetection;
        /** minimal no of characters that needs to be entered before
         * typeahead kicks-in. When set to 0, typeahead shows on focus with full
         * list of options (limited as normal by typeaheadOptionsLimit)
         */
        this.typeaheadMinLength = void 0;
        /** should be used only in case of typeahead attribute is array.
         * If true - loading of options will be async, otherwise - sync.
         * true make sense if options array is large.
         */
        this.typeaheadAsync = void 0;
        /** match latin symbols.
         * If true the word súper would match super and vice versa.
         */
        this.typeaheadLatinize = true;
        /** break words with spaces. If true the text "exact phrase"
         * here match would match with match exact phrase here
         * but not with phrase here exact match (kind of "google style").
         */
        this.typeaheadSingleWords = true;
        /** should be used only in case typeaheadSingleWords attribute is true.
         * Sets the word delimiter to break words. Defaults to space.
         */
        this.typeaheadWordDelimiters = ' ';
        /** should be used only in case typeaheadSingleWords attribute is true.
         * Sets the word delimiter to match exact phrase.
         * Defaults to simple and double quotes.
         */
        this.typeaheadPhraseDelimiters = '\'"';
        /** specifies if typeahead is scrollable  */
        this.typeaheadScrollable = false;
        /** specifies number of options to show in scroll view  */
        this.typeaheadOptionsInScrollableView = 5;
        /** fired when 'busy' state of this component was changed,
         * fired on async mode only, returns boolean
         */
        this.typeaheadLoading = new EventEmitter();
        /** fired on every key event and returns true
         * in case of matches are not detected
         */
        this.typeaheadNoResults = new EventEmitter();
        /** fired when option was selected, return object with data of this option */
        this.typeaheadOnSelect = new EventEmitter();
        /** fired when blur event occurres. returns the active item */
        this.typeaheadOnBlur = new EventEmitter();
        /** This attribute indicates that the dropdown should be opened upwards */
        this.dropup = false;
        this.isTypeaheadOptionsListActive = false;
        this.keyUpEventEmitter = new EventEmitter();
        this.placement = 'bottom-left';
        this._subscriptions = [];
        this._typeahead = cis.createLoader(element, viewContainerRef, renderer);
    }
    TypeaheadDirective.prototype.ngOnInit = function () {
        this.typeaheadOptionsLimit = this.typeaheadOptionsLimit || 20;
        this.typeaheadMinLength =
            this.typeaheadMinLength === void 0 ? 1 : this.typeaheadMinLength;
        this.typeaheadWaitMs = this.typeaheadWaitMs || 0;
        // async should be false in case of array
        if (this.typeaheadAsync === undefined &&
            !(this.typeahead instanceof Observable$1)) {
            this.typeaheadAsync = false;
        }
        if (this.typeahead instanceof Observable$1) {
            this.typeaheadAsync = true;
        }
        if (this.typeaheadAsync) {
            this.asyncActions();
        }
        else {
            this.syncActions();
        }
    };
    TypeaheadDirective.prototype.onInput = function (e) {
        // For `<input>`s, use the `value` property. For others that don't have a
        // `value` (such as `<span contenteditable="true">`), use either
        // `textContent` or `innerText` (depending on which one is supported, i.e.
        // Firefox or IE).
        var value = e.target.value !== undefined
            ? e.target.value
            : e.target.textContent !== undefined
                ? e.target.textContent
                : e.target.innerText;
        if (value != null && value.trim().length >= this.typeaheadMinLength) {
            this.typeaheadLoading.emit(true);
            this.keyUpEventEmitter.emit(e.target.value);
        }
        else {
            this.typeaheadLoading.emit(false);
            this.typeaheadNoResults.emit(false);
            this.hide();
        }
    };
    TypeaheadDirective.prototype.onChange = function (e) {
        if (this._container) {
            // esc
            if (e.keyCode === 27) {
                this.hide();
                return;
            }
            // up
            if (e.keyCode === 38) {
                this._container.prevActiveMatch();
                return;
            }
            // down
            if (e.keyCode === 40) {
                this._container.nextActiveMatch();
                return;
            }
            // enter, tab
            if (e.keyCode === 13 || e.keyCode === 9) {
                this._container.selectActiveMatch();
                return;
            }
        }
    };
    TypeaheadDirective.prototype.onFocus = function () {
        if (this.typeaheadMinLength === 0) {
            this.typeaheadLoading.emit(true);
            this.keyUpEventEmitter.emit('');
        }
    };
    TypeaheadDirective.prototype.onBlur = function () {
        if (this._container && !this._container.isFocused) {
            this.typeaheadOnBlur.emit(this._container.active);
        }
    };
    TypeaheadDirective.prototype.onKeydown = function (e) {
        // no container - no problems
        if (!this._container) {
            return;
        }
        // if an item is visible - prevent form submission
        if (e.keyCode === 13) {
            e.preventDefault();
            return;
        }
        // if an item is visible - don't change focus
        if (e.keyCode === 9) {
            e.preventDefault();
            return;
        }
    };
    TypeaheadDirective.prototype.changeModel = function (match) {
        var valueStr = match.value;
        this.ngControl.viewToModelUpdate(valueStr);
        (this.ngControl.control).setValue(valueStr);
        this.changeDetection.markForCheck();
        this.hide();
    };
    Object.defineProperty(TypeaheadDirective.prototype, "matches", {
        get: function () {
            return this._matches;
        },
        enumerable: true,
        configurable: true
    });
    TypeaheadDirective.prototype.show = function () {
        var _this = this;
        this._typeahead
            .attach(TypeaheadContainerComponent)
            .to(this.container)
            .position({ attachment: (this.dropup ? 'top' : 'bottom') + " left" })
            .show({
            typeaheadRef: this,
            placement: this.placement,
            animation: false,
            dropup: this.dropup
        });
        this._outsideClickListener = this.renderer.listen('document', 'click', function () {
            _this.onOutsideClick();
        });
        this._container = this._typeahead.instance;
        this._container.parent = this;
        // This improves the speed as it won't have to be done for each list item
        var normalizedQuery = (this.typeaheadLatinize
            ? latinize(this.ngControl.control.value)
            : this.ngControl.control.value)
            .toString()
            .toLowerCase();
        this._container.query = this.typeaheadSingleWords
            ? tokenize(normalizedQuery, this.typeaheadWordDelimiters, this.typeaheadPhraseDelimiters)
            : normalizedQuery;
        this._container.matches = this._matches;
        this.element.nativeElement.focus();
    };
    TypeaheadDirective.prototype.hide = function () {
        if (this._typeahead.isShown) {
            this._typeahead.hide();
            this._outsideClickListener();
            this._container = null;
        }
    };
    TypeaheadDirective.prototype.onOutsideClick = function () {
        if (this._container && !this._container.isFocused) {
            this.hide();
        }
    };
    TypeaheadDirective.prototype.ngOnDestroy = function () {
        // clean up subscriptions
        for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
            var sub = _a[_i];
            sub.unsubscribe();
        }
        this._typeahead.dispose();
    };
    TypeaheadDirective.prototype.asyncActions = function () {
        var _this = this;
        this._subscriptions.push(this.keyUpEventEmitter
            .debounceTime(this.typeaheadWaitMs)
            .mergeMap(function () { return _this.typeahead; })
            .subscribe(function (matches) {
            _this.finalizeAsyncCall(matches);
        }));
    };
    TypeaheadDirective.prototype.syncActions = function () {
        var _this = this;
        this._subscriptions.push(this.keyUpEventEmitter
            .debounceTime(this.typeaheadWaitMs)
            .mergeMap(function (value) {
            var normalizedQuery = _this.normalizeQuery(value);
            return Observable$1.from(_this.typeahead)
                .filter(function (option) {
                return (option &&
                    _this.testMatch(_this.normalizeOption(option), normalizedQuery));
            })
                .toArray();
        })
            .subscribe(function (matches) {
            _this.finalizeAsyncCall(matches);
        }));
    };
    TypeaheadDirective.prototype.normalizeOption = function (option) {
        var optionValue = getValueFromObject(option, this.typeaheadOptionField);
        var normalizedOption = this.typeaheadLatinize
            ? latinize(optionValue)
            : optionValue;
        return normalizedOption.toLowerCase();
    };
    TypeaheadDirective.prototype.normalizeQuery = function (value) {
        // If singleWords, break model here to not be doing extra work on each
        // iteration
        var normalizedQuery = (this.typeaheadLatinize
            ? latinize(value)
            : value)
            .toString()
            .toLowerCase();
        normalizedQuery = this.typeaheadSingleWords
            ? tokenize(normalizedQuery, this.typeaheadWordDelimiters, this.typeaheadPhraseDelimiters)
            : normalizedQuery;
        return normalizedQuery;
    };
    TypeaheadDirective.prototype.testMatch = function (match, test) {
        var spaceLength;
        if (typeof test === 'object') {
            spaceLength = test.length;
            for (var i = 0; i < spaceLength; i += 1) {
                if (test[i].length > 0 && match.indexOf(test[i]) < 0) {
                    return false;
                }
            }
            return true;
        }
        return match.indexOf(test) >= 0;
    };
    TypeaheadDirective.prototype.finalizeAsyncCall = function (matches) {
        this.prepareMatches(matches);
        this.typeaheadLoading.emit(false);
        this.typeaheadNoResults.emit(!this.hasMatches());
        if (!this.hasMatches()) {
            this.hide();
            return;
        }
        if (this._container) {
            // This improves the speed as it won't have to be done for each list item
            var normalizedQuery = (this.typeaheadLatinize
                ? latinize(this.ngControl.control.value)
                : this.ngControl.control.value)
                .toString()
                .toLowerCase();
            this._container.query = this.typeaheadSingleWords
                ? tokenize(normalizedQuery, this.typeaheadWordDelimiters, this.typeaheadPhraseDelimiters)
                : normalizedQuery;
            this._container.matches = this._matches;
        }
        else {
            this.show();
        }
    };
    TypeaheadDirective.prototype.prepareMatches = function (options) {
        var _this = this;
        var limited = options.slice(0, this.typeaheadOptionsLimit);
        if (this.typeaheadGroupField) {
            var matches_1 = [];
            // extract all group names
            var groups = limited
                .map(function (option) {
                return getValueFromObject(option, _this.typeaheadGroupField);
            })
                .filter(function (v, i, a) { return a.indexOf(v) === i; });
            groups.forEach(function (group) {
                // add group header to array of matches
                matches_1.push(new TypeaheadMatch(group, group, true));
                // add each item of group to array of matches
                matches_1 = matches_1.concat(limited
                    .filter(function (option) {
                    return getValueFromObject(option, _this.typeaheadGroupField) === group;
                })
                    .map(function (option) {
                    return new TypeaheadMatch(option, getValueFromObject(option, _this.typeaheadOptionField));
                }));
            });
            this._matches = matches_1;
        }
        else {
            this._matches = limited.map(function (option) {
                return new TypeaheadMatch(option, getValueFromObject(option, _this.typeaheadOptionField));
            });
        }
    };
    TypeaheadDirective.prototype.hasMatches = function () {
        return this._matches.length > 0;
    };
    TypeaheadDirective.decorators = [
        { type: Directive, args: [{ selector: '[typeahead]', exportAs: 'bs-typeahead' },] },
    ];
    /** @nocollapse */
    TypeaheadDirective.ctorParameters = function () { return [
        { type: NgControl, },
        { type: ElementRef, },
        { type: ViewContainerRef, },
        { type: Renderer2, },
        { type: ComponentLoaderFactory, },
        { type: ChangeDetectorRef, },
    ]; };
    TypeaheadDirective.propDecorators = {
        'typeahead': [{ type: Input },],
        'typeaheadMinLength': [{ type: Input },],
        'typeaheadWaitMs': [{ type: Input },],
        'typeaheadOptionsLimit': [{ type: Input },],
        'typeaheadOptionField': [{ type: Input },],
        'typeaheadGroupField': [{ type: Input },],
        'typeaheadAsync': [{ type: Input },],
        'typeaheadLatinize': [{ type: Input },],
        'typeaheadSingleWords': [{ type: Input },],
        'typeaheadWordDelimiters': [{ type: Input },],
        'typeaheadPhraseDelimiters': [{ type: Input },],
        'typeaheadItemTemplate': [{ type: Input },],
        'optionsListTemplate': [{ type: Input },],
        'typeaheadScrollable': [{ type: Input },],
        'typeaheadOptionsInScrollableView': [{ type: Input },],
        'typeaheadLoading': [{ type: Output },],
        'typeaheadNoResults': [{ type: Output },],
        'typeaheadOnSelect': [{ type: Output },],
        'typeaheadOnBlur': [{ type: Output },],
        'container': [{ type: Input },],
        'dropup': [{ type: Input },],
        'onInput': [{ type: HostListener, args: ['input', ['$event'],] },],
        'onChange': [{ type: HostListener, args: ['keyup', ['$event'],] },],
        'onFocus': [{ type: HostListener, args: ['click',] }, { type: HostListener, args: ['focus',] },],
        'onBlur': [{ type: HostListener, args: ['blur',] },],
        'onKeydown': [{ type: HostListener, args: ['keydown', ['$event'],] },],
    };
    return TypeaheadDirective;
}());

var TypeaheadModule = (function () {
    function TypeaheadModule() {
    }
    TypeaheadModule.forRoot = function () {
        return {
            ngModule: TypeaheadModule,
            providers: [ComponentLoaderFactory, PositioningService]
        };
    };
    TypeaheadModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: [TypeaheadContainerComponent, TypeaheadDirective],
                    exports: [TypeaheadContainerComponent, TypeaheadDirective],
                    entryComponents: [TypeaheadContainerComponent]
                },] },
    ];
    /** @nocollapse */
    TypeaheadModule.ctorParameters = function () { return []; };
    return TypeaheadModule;
}());

/**
 * Configuration service for the Popover directive.
 * You can inject this service, typically in your root component, and customize
 * the values of its properties in order to provide default values for all the
 * popovers used in the application.
 */
var PopoverConfig = (function () {
    function PopoverConfig() {
        /**
         * Placement of a popover. Accepts: "top", "bottom", "left", "right", "auto"
         */
        this.placement = 'top';
        /**
         * Specifies events that should trigger. Supports a space separated list of
         * event names.
         */
        this.triggers = 'click';
        this.outsideClick = false;
    }
    PopoverConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    PopoverConfig.ctorParameters = function () { return []; };
    return PopoverConfig;
}());

var PopoverContainerComponent = (function () {
    function PopoverContainerComponent(config) {
        Object.assign(this, config);
    }
    Object.defineProperty(PopoverContainerComponent.prototype, "isBs3", {
        get: function () {
            return isBs3();
        },
        enumerable: true,
        configurable: true
    });
    PopoverContainerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'popover-container',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    // tslint:disable-next-line
                    host: {
                        '[class]': '"popover in popover-" + placement + " " + "bs-popover-" + placement + " " + placement + " " + containerClass',
                        '[class.show]': '!isBs3',
                        role: 'tooltip',
                        style: 'display:block;'
                    },
                    styles: [
                        "\n    :host.bs-popover-top .arrow, :host.bs-popover-bottom .arrow {\n      left: calc(50% - 5px);\n    }\n    :host.bs-popover-left .arrow, :host.bs-popover-right .arrow {\n      top: calc(50% - 2.5px);\n    }\n  "
                    ],
                    template: "<div class=\"popover-arrow arrow\"></div> <h3 class=\"popover-title popover-header\" *ngIf=\"title\">{{ title }}</h3> <div class=\"popover-content popover-body\"> <ng-content></ng-content> </div> "
                },] },
    ];
    /** @nocollapse */
    PopoverContainerComponent.ctorParameters = function () { return [
        { type: PopoverConfig, },
    ]; };
    PopoverContainerComponent.propDecorators = {
        'placement': [{ type: Input },],
        'title': [{ type: Input },],
    };
    return PopoverContainerComponent;
}());

/**
 * A lightweight, extensible directive for fancy popover creation.
 */
var PopoverDirective = (function () {
    function PopoverDirective(_elementRef, _renderer, _viewContainerRef, _config, cis) {
        /**
         * Close popover on outside click
         */
        this.outsideClick = false;
        /**
         * Css class for popover container
         */
        this.containerClass = '';
        this._isInited = false;
        this._popover = cis
            .createLoader(_elementRef, _viewContainerRef, _renderer)
            .provide({ provide: PopoverConfig, useValue: _config });
        Object.assign(this, _config);
        this.onShown = this._popover.onShown;
        this.onHidden = this._popover.onHidden;
        // fix: no focus on button on Mac OS #1795
        if (typeof window !== 'undefined') {
            _elementRef.nativeElement.addEventListener('click', function () {
                try {
                    _elementRef.nativeElement.focus();
                }
                catch (err) {
                    return;
                }
            });
        }
    }
    Object.defineProperty(PopoverDirective.prototype, "isOpen", {
        /**
         * Returns whether or not the popover is currently being shown
         */
        get: function () {
            return this._popover.isShown;
        },
        set: function (value) {
            if (value) {
                this.show();
            }
            else {
                this.hide();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Opens an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    PopoverDirective.prototype.show = function () {
        if (this._popover.isShown || !this.popover) {
            return;
        }
        this._popover
            .attach(PopoverContainerComponent)
            .to(this.container)
            .position({ attachment: this.placement })
            .show({
            content: this.popover,
            context: this.popoverContext,
            placement: this.placement,
            title: this.popoverTitle,
            containerClass: this.containerClass
        });
        this.isOpen = true;
    };
    /**
     * Closes an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    PopoverDirective.prototype.hide = function () {
        if (this.isOpen) {
            this._popover.hide();
            this.isOpen = false;
        }
    };
    /**
     * Toggles an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    PopoverDirective.prototype.toggle = function () {
        if (this.isOpen) {
            return this.hide();
        }
        this.show();
    };
    PopoverDirective.prototype.ngOnInit = function () {
        var _this = this;
        // fix: seems there are an issue with `routerLinkActive`
        // which result in duplicated call ngOnInit without call to ngOnDestroy
        // read more: https://github.com/valor-software/ngx-bootstrap/issues/1885
        if (this._isInited) {
            return;
        }
        this._isInited = true;
        this._popover.listen({
            triggers: this.triggers,
            outsideClick: this.outsideClick,
            show: function () { return _this.show(); }
        });
    };
    PopoverDirective.prototype.ngOnDestroy = function () {
        this._popover.dispose();
    };
    PopoverDirective.decorators = [
        { type: Directive, args: [{ selector: '[popover]', exportAs: 'bs-popover' },] },
    ];
    /** @nocollapse */
    PopoverDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Renderer2, },
        { type: ViewContainerRef, },
        { type: PopoverConfig, },
        { type: ComponentLoaderFactory, },
    ]; };
    PopoverDirective.propDecorators = {
        'popover': [{ type: Input },],
        'popoverContext': [{ type: Input },],
        'popoverTitle': [{ type: Input },],
        'placement': [{ type: Input },],
        'outsideClick': [{ type: Input },],
        'triggers': [{ type: Input },],
        'container': [{ type: Input },],
        'containerClass': [{ type: Input },],
        'isOpen': [{ type: Input },],
        'onShown': [{ type: Output },],
        'onHidden': [{ type: Output },],
    };
    return PopoverDirective;
}());

// moment.js locale configuration
// locale : Arabic [ar]
// author : Abdel Said: https://github.com/abdelsaid
// author : Ahmed Elkhatib
// author : forabi https://github.com/forabi
var symbolMap = {
    1: '١',
    2: '٢',
    3: '٣',
    4: '٤',
    5: '٥',
    6: '٦',
    7: '٧',
    8: '٨',
    9: '٩',
    0: '٠'
};
var numberMap = {
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    '٠': '0'
};
var pluralForm = function (n) {
    return n === 0
        ? 0
        : n === 1
            ? 1
            : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
};
var plurals = {
    s: [
        'أقل من ثانية',
        'ثانية واحدة',
        ['ثانيتان', 'ثانيتين'],
        '%d ثوان',
        '%d ثانية',
        '%d ثانية'
    ],
    m: [
        'أقل من دقيقة',
        'دقيقة واحدة',
        ['دقيقتان', 'دقيقتين'],
        '%d دقائق',
        '%d دقيقة',
        '%d دقيقة'
    ],
    h: [
        'أقل من ساعة',
        'ساعة واحدة',
        ['ساعتان', 'ساعتين'],
        '%d ساعات',
        '%d ساعة',
        '%d ساعة'
    ],
    d: [
        'أقل من يوم',
        'يوم واحد',
        ['يومان', 'يومين'],
        '%d أيام',
        '%d يومًا',
        '%d يوم'
    ],
    M: [
        'أقل من شهر',
        'شهر واحد',
        ['شهران', 'شهرين'],
        '%d أشهر',
        '%d شهرا',
        '%d شهر'
    ],
    y: [
        'أقل من عام',
        'عام واحد',
        ['عامان', 'عامين'],
        '%d أعوام',
        '%d عامًا',
        '%d عام'
    ]
};
var pluralize = function (u) {
    return function (num, withoutSuffix /*, string, isFuture*/) {
        var f = pluralForm(num);
        var str = plurals[u][pluralForm(num)];
        if (f === 2) {
            str = str[withoutSuffix ? 0 : 1];
        }
        return str.replace(/%d/i, num);
    };
};
var months = [
    'كانون الثاني يناير',
    'شباط فبراير',
    'آذار مارس',
    'نيسان أبريل',
    'أيار مايو',
    'حزيران يونيو',
    'تموز يوليو',
    'آب أغسطس',
    'أيلول سبتمبر',
    'تشرين الأول أكتوبر',
    'تشرين الثاني نوفمبر',
    'كانون الأول ديسمبر'
];
var ar = {
    abbr: 'ar',
    months: months,
    monthsShort: months,
    weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
    weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
    weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'D/\u200FM/\u200FYYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd D MMMM YYYY HH:mm'
    },
    meridiemParse: /ص|م/,
    isPM: function (input) {
        return input === 'م';
    },
    meridiem: function (hour, minute, isLower) {
        if (hour < 12) {
            return 'ص';
        }
        else {
            return 'م';
        }
    },
    calendar: {
        sameDay: '[اليوم عند الساعة] LT',
        nextDay: '[غدًا عند الساعة] LT',
        nextWeek: 'dddd [عند الساعة] LT',
        lastDay: '[أمس عند الساعة] LT',
        lastWeek: 'dddd [عند الساعة] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'بعد %s',
        past: 'منذ %s',
        s: pluralize('s'),
        m: pluralize('m'),
        mm: pluralize('m'),
        h: pluralize('h'),
        hh: pluralize('h'),
        d: pluralize('d'),
        dd: pluralize('d'),
        M: pluralize('M'),
        MM: pluralize('M'),
        y: pluralize('y'),
        yy: pluralize('y')
    },
    preparse: function (str) {
        return str
            .replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
            return numberMap[match];
        })
            .replace(/،/g, ',');
    },
    postformat: function (str) {
        return str
            .replace(/\d/g, function (match) {
            return symbolMap[match];
        })
            .replace(/,/g, '،');
    },
    week: {
        dow: 6,
        doy: 12 // The week that contains Jan 1st is the first week of the year.
    }
};

// moment.js locale configuration
// locale : Czech [cs]
// author : petrbela : https://github.com/petrbela
// ported by: Frantisek Jandos : https://github.com/frantisekjandos
function plural(n) {
    return (n % 10 < 5) && (n % 10 > 1) && ((~~(n / 10) % 10) !== 1);
}
function translate(num, withoutSuffix, key, isFuture) {
    var result = num + ' ';
    switch (key) {
        case 's':// a few seconds / in a few seconds / a few seconds ago
            return (withoutSuffix || isFuture) ? 'pár sekund' : 'pár sekundami';
        case 'm':// a minute / in a minute / a minute ago
            return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
        case 'mm':// 9 minutes / in 9 minutes / 9 minutes ago
            if (withoutSuffix || isFuture) {
                return result + (plural(num) ? 'minuty' : 'minut');
            }
            return result + 'minutami';
        case 'h':// an hour / in an hour / an hour ago
            return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
        case 'hh':// 9 hours / in 9 hours / 9 hours ago
            if (withoutSuffix || isFuture) {
                return result + (plural(num) ? 'hodiny' : 'hodin');
            }
            return result + 'hodinami';
        case 'd':// a day / in a day / a day ago
            return (withoutSuffix || isFuture) ? 'den' : 'dnem';
        case 'dd':// 9 days / in 9 days / 9 days ago
            if (withoutSuffix || isFuture) {
                return result + (plural(num) ? 'dny' : 'dní');
            }
            return result + 'dny';
        case 'M':// a month / in a month / a month ago
            return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
        case 'MM':// 9 months / in 9 months / 9 months ago
            if (withoutSuffix || isFuture) {
                return result + (plural(num) ? 'měsíce' : 'měsíců');
            }
            return result + 'měsíci';
        case 'y':// a year / in a year / a year ago
            return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
        case 'yy':// 9 years / in 9 years / 9 years ago
            if (withoutSuffix || isFuture) {
                return result + (plural(num) ? 'roky' : 'let');
            }
            return result + 'lety';
    }
}
var cs = {
    abbr: 'cs',
    months: 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split('_'),
    monthsShort: 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_'),
    weekdays: 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
    weekdaysShort: 'ne_po_út_st_čt_pá_so'.split('_'),
    weekdaysMin: 'ne_po_út_st_čt_pá_so'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D. MMMM YYYY',
        LLL: 'D. MMMM YYYY HH:mm',
        LLLL: 'dddd, D. MMMM YYYY HH:mm',
        l: 'D. M. YYYY'
    },
    calendar: {
        sameDay: '[dnes v] LT',
        nextDay: '[zítra v] LT',
        nextWeek: '[příští] dddd [v] LT',
        lastDay: '[včera v] LT',
        lastWeek: '[minulý] dddd [v] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'za %s',
        past: 'před %s',
        s: translate,
        m: translate,
        mm: translate,
        h: translate,
        hh: translate,
        d: translate,
        dd: translate,
        M: translate,
        MM: translate,
        y: translate,
        yy: translate
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal: function (num) { return num + "."; },
    week: {
        dow: 1,
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
};

// moment.js locale configuration
// locale : German [de]
// author : lluchs : https://github.com/lluchs
// author: Menelion Elensúle: https://github.com/Oire
// author : Mikolaj Dadela : https://github.com/mik01aj
function processRelativeTime(num, withoutSuffix, key, isFuture) {
    var str = num.toString();
    var format = {
        m: ['eine Minute', 'einer Minute'],
        h: ['eine Stunde', 'einer Stunde'],
        d: ['ein Tag', 'einem Tag'],
        dd: [str + " Tage", str + " Tagen"],
        M: ['ein Monat', 'einem Monat'],
        MM: [str + " Monate", str + " Monaten"],
        y: ['ein Jahr', 'einem Jahr'],
        yy: [str + " Jahre", str + " Jahren"]
    };
    return withoutSuffix ? format[key][0] : format[key][1];
}
var de = {
    abbr: 'de',
    months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
    monthsShort: 'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
    monthsParseExact: true,
    weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
    weekdaysShort: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
    weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D. MMMM YYYY',
        LLL: 'D. MMMM YYYY HH:mm',
        LLLL: 'dddd, D. MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[heute um] LT [Uhr]',
        sameElse: 'L',
        nextDay: '[morgen um] LT [Uhr]',
        nextWeek: 'dddd [um] LT [Uhr]',
        lastDay: '[gestern um] LT [Uhr]',
        lastWeek: '[letzten] dddd [um] LT [Uhr]'
    },
    relativeTime: {
        future: 'in %s',
        past: 'vor %s',
        s: 'ein paar Sekunden',
        m: processRelativeTime,
        mm: '%d Minuten',
        h: processRelativeTime,
        hh: '%d Stunden',
        d: processRelativeTime,
        dd: processRelativeTime,
        M: processRelativeTime,
        MM: processRelativeTime,
        y: processRelativeTime,
        yy: processRelativeTime
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal: function (num, token) {
        return num + ".";
    },
    week: {
        dow: 1,
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
};

// moment.js locale configuration
// locale : English (United Kingdom) [en-gb]
// author : Chris Gedrim : https://github.com/chrisgedrim
var enGb = {
    abbr: 'en-gb',
    months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
    ordinal: function (num) {
        var b = num % 10;
        var output = Math.trunc((num % 100) / 10) === 1
            ? 'th'
            : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
        return num + output;
    },
    week: {
        dow: 1,
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
};

// moment.js locale configuration
// locale : Spanish [es]
// author : Julio Napurí : https://github.com/julionc
// const monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
var monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');
var monthsParse = [
    /^ene/i,
    /^feb/i,
    /^mar/i,
    /^abr/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^ago/i,
    /^sep/i,
    /^oct/i,
    /^nov/i,
    /^dic/i
];
// tslint:disable-next-line
var monthsRegex = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;
var es = {
    abbr: 'es',
    months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    // monthsShort(date: Date, format: string): string {
    //   if (!date) {
    //     return monthsShortDot;
    //   } else if (/-MMM-/.test(format)) {
    //     return monthsShort[getMonth(date)];
    //   } else {
    //     return monthsShortDot[getMonth(date)];
    //   }
    // },
    monthsShort: monthsShort,
    monthsRegex: monthsRegex,
    monthsShortRegex: monthsRegex,
    monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
    monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
    monthsParse: monthsParse,
    longMonthsParse: monthsParse,
    shortMonthsParse: monthsParse,
    weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'H:mm',
        LTS: 'H:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D [de] MMMM [de] YYYY',
        LLL: 'D [de] MMMM [de] YYYY H:mm',
        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
    },
    relativeTime: {
        future: 'en %s',
        past: 'hace %s',
        s: 'unos segundos',
        m: 'un minuto',
        mm: '%d minutos',
        h: 'una hora',
        hh: '%d horas',
        d: 'un día',
        dd: '%d días',
        M: 'un mes',
        MM: '%d meses',
        y: 'un año',
        yy: '%d años'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal: function (num) {
        return num + "\u00BA";
    },
    week: {
        dow: 1,
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
};

// moment.js locale configuration
// locale : Spanish (Dominican Republic) [es-do]
// const monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
var monthsShort$1 = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');
var monthsParse$1 = [
    /^ene/i,
    /^feb/i,
    /^mar/i,
    /^abr/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^ago/i,
    /^sep/i,
    /^oct/i,
    /^nov/i,
    /^dic/i
];
// tslint:disable-next-line
var monthsRegex$1 = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;
var esDo = {
    abbr: 'es-do',
    months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    monthsShort: monthsShort$1,
    // monthsShort(date: Date, format: string): string {
    //   if (!date) {
    //     return monthsShortDot;
    //   } else if (/-MMM-/.test(format)) {
    //     return monthsShort[getMonth(date)];
    //   } else {
    //     return monthsShortDot[getMonth(date)];
    //   }
    // },
    monthsRegex: monthsRegex$1,
    monthsShortRegex: monthsRegex$1,
    monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
    monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
    monthsParse: monthsParse$1,
    longMonthsParse: monthsParse$1,
    shortMonthsParse: monthsParse$1,
    weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'h:mm A',
        LTS: 'h:mm:ss A',
        L: 'DD/MM/YYYY',
        LL: 'D [de] MMMM [de] YYYY',
        LLL: 'D [de] MMMM [de] YYYY h:mm A',
        LLLL: 'dddd, D [de] MMMM [de] YYYY h:mm A'
    },
    relativeTime: {
        future: 'en %s',
        past: 'hace %s',
        s: 'unos segundos',
        m: 'un minuto',
        mm: '%d minutos',
        h: 'una hora',
        hh: '%d horas',
        d: 'un día',
        dd: '%d días',
        M: 'un mes',
        MM: '%d meses',
        y: 'un año',
        yy: '%d años'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal: function (num) {
        return num + "\u00BA";
    },
    week: {
        dow: 1,
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
};

// moment.js locale configuration
// locale : Spanish(United State) [es-us]
// author : bustta : https://github.com/bustta
// const monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
var monthsShort$2 = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');
var esUs = {
    abbr: 'es-us',
    months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    monthsShort: monthsShort$2,
    // monthsShort(date: Date, format: string): string {
    //   if (!date) {
    //     return monthsShortDot;
    //   } else if (/-MMM-/.test(format)) {
    //     return monthsShort[getMonth(date)];
    //   } else {
    //     return monthsShortDot[getMonth(date)];
    //   }
    // },
    monthsParseExact: true,
    weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'H:mm',
        LTS: 'H:mm:ss',
        L: 'MM/DD/YYYY',
        LL: 'MMMM [de] D [de] YYYY',
        LLL: 'MMMM [de] D [de] YYYY H:mm',
        LLLL: 'dddd, MMMM [de] D [de] YYYY H:mm'
    },
    relativeTime: {
        future: 'en %s',
        past: 'hace %s',
        s: 'unos segundos',
        m: 'un minuto',
        mm: '%d minutos',
        h: 'una hora',
        hh: '%d horas',
        d: 'un día',
        dd: '%d días',
        M: 'un mes',
        MM: '%d meses',
        y: 'un año',
        yy: '%d años'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal: function (num) {
        return num + "\u00BA";
    },
    week: {
        dow: 0,
        doy: 6 // The week that contains Jan 1st is the first week of the year.
    }
};

// moment.js locale configuration
// locale : French [fr]
// author : John Fischer : https://github.com/jfroffice
var fr = {
    abbr: 'fr',
    months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact: true,
    weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[Aujourd’hui à] LT',
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'dans %s',
        past: 'il y a %s',
        s: 'quelques secondes',
        m: 'une minute',
        mm: '%d minutes',
        h: 'une heure',
        hh: '%d heures',
        d: 'un jour',
        dd: '%d jours',
        M: 'un mois',
        MM: '%d mois',
        y: 'un an',
        yy: '%d ans'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
    ordinal: function (num, period) {
        switch (period) {
            // TODO: Return 'e' when day of month > 1. Move this case inside
            // block for masculine words below.
            // See https://github.com/moment/moment/issues/3375
            case 'D':
                var endingD = num === 1 ? 'er' : '';
                return "" + num + endingD;
            // Words with masculine grammatical gender: mois, trimestre, jour
            default:
            case 'M':
            case 'Q':
            case 'DDD':
            case 'd':
                var endingd = num === 1 ? 'er' : 'e';
                return "" + num + endingd;
            // Words with feminine grammatical gender: semaine
            case 'w':
            case 'W':
                var endingW = num === 1 ? 're' : 'e';
                return "" + num + endingW;
        }
    },
    week: {
        dow: 1,
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
};

// moment.js locale configuration
// locale : Hindi [hi]
// author : Mayank Singhal : https://github.com/mayanksinghal
var symbolMap$1 = {
    1: '१',
    2: '२',
    3: '३',
    4: '४',
    5: '५',
    6: '६',
    7: '७',
    8: '८',
    9: '९',
    0: '०'
};
var numberMap$1 = {
    '१': '1',
    '२': '2',
    '३': '3',
    '४': '4',
    '५': '5',
    '६': '6',
    '७': '7',
    '८': '8',
    '९': '9',
    '०': '0'
};
var hi = {
    abbr: 'hi',
    months: 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर'.split('_'),
    monthsShort: 'जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.'.split('_'),
    monthsParseExact: true,
    weekdays: 'रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
    weekdaysShort: 'रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि'.split('_'),
    weekdaysMin: 'र_सो_मं_बु_गु_शु_श'.split('_'),
    longDateFormat: {
        LT: 'A h:mm बजे',
        LTS: 'A h:mm:ss बजे',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY, A h:mm बजे',
        LLLL: 'dddd, D MMMM YYYY, A h:mm बजे'
    },
    calendar: {
        sameDay: '[आज] LT',
        nextDay: '[कल] LT',
        nextWeek: 'dddd, LT',
        lastDay: '[कल] LT',
        lastWeek: '[पिछले] dddd, LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: '%s में',
        past: '%s पहले',
        s: 'कुछ ही क्षण',
        m: 'एक मिनट',
        mm: '%d मिनट',
        h: 'एक घंटा',
        hh: '%d घंटे',
        d: 'एक दिन',
        dd: '%d दिन',
        M: 'एक महीने',
        MM: '%d महीने',
        y: 'एक वर्ष',
        yy: '%d वर्ष'
    },
    preparse: function (str) {
        return str.replace(/[१२३४५६७८९०]/g, function (match) {
            return numberMap$1[match];
        });
    },
    postformat: function (str) {
        return str.replace(/\d/g, function (match) {
            return symbolMap$1[match];
        });
    },
    // Hindi notation for meridiems are quite fuzzy in practice. While there
    // exists a rigid notion of a 'Pahar' it is not used as rigidly in modern
    // Hindi.
    meridiemParse: /रात|सुबह|दोपहर|शाम/,
    meridiemHour: function (_hour, meridiem) {
        var hour = _hour === 12 ? 0 : _hour;
        // tslint:disable
        if (meridiem === 'रात') {
            return hour < 4 ? hour : hour + 12;
        }
        else if (meridiem === 'सुबह') {
            return hour;
        }
        else if (meridiem === 'दोपहर') {
            return hour >= 10 ? hour : hour + 12;
        }
        else if (meridiem === 'शाम') {
            return hour + 12;
        }
    },
    meridiem: function (hour) {
        if (hour < 4) {
            return 'रात';
        }
        else if (hour < 10) {
            return 'सुबह';
        }
        else if (hour < 17) {
            return 'दोपहर';
        }
        else if (hour < 20) {
            return 'शाम';
        }
        else {
            return 'रात';
        }
    },
    week: {
        dow: 0,
        doy: 6 // The week that contains Jan 1st is the first week of the year.
    }
};

// moment.js locale configuration
// locale : Italian [it]
// author : Lorenzo : https://github.com/aliem
// author: Mattia Larentis: https://github.com/nostalgiaz
var it = {
    abbr: 'it',
    months: 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
    monthsShort: 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
    weekdays: 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato'.split('_'),
    weekdaysShort: 'dom_lun_mar_mer_gio_ven_sab'.split('_'),
    weekdaysMin: 'do_lu_ma_me_gi_ve_sa'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal: function (num) {
        return num + "\u00BA";
    },
    week: {
        dow: 1,
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
};

// moment.js locale configuration
// locale : Japanese [ja]
// author : LI Long : https://github.com/baryon
var ja = {
    abbr: 'ja',
    months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
    weekdaysShort: '日_月_火_水_木_金_土'.split('_'),
    weekdaysMin: '日_月_火_水_木_金_土'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'YYYY/MM/DD',
        LL: 'YYYY年M月D日',
        LLL: 'YYYY年M月D日 HH:mm',
        LLLL: 'YYYY年M月D日 HH:mm dddd',
        l: 'YYYY/MM/DD',
        ll: 'YYYY年M月D日',
        lll: 'YYYY年M月D日 HH:mm',
        llll: 'YYYY年M月D日 HH:mm dddd'
    },
    meridiemParse: /午前|午後/i,
    isPM: function (input) {
        return input === '午後';
    },
    meridiem: function (hour) {
        return hour < 12 ? '午前' : '午後';
    },
    calendar: {
        sameDay: '[今日] LT',
        nextDay: '[明日] LT',
        nextWeek: '[来週]dddd LT',
        lastDay: '[昨日] LT',
        lastWeek: '[前週]dddd LT',
        sameElse: 'L'
    },
    dayOfMonthOrdinalParse: /\d{1,2}日/,
    ordinal: function (num, period) {
        switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return num + "\u65E5";
            default:
                return num.toString();
        }
    },
    relativeTime: {
        future: '%s後',
        past: '%s前',
        s: '数秒',
        m: '1分',
        mm: '%d分',
        h: '1時間',
        hh: '%d時間',
        d: '1日',
        dd: '%d日',
        M: '1ヶ月',
        MM: '%dヶ月',
        y: '1年',
        yy: '%d年'
    }
};

// moment.js locale configuration
// locale : Korean [ko]
// author : Kyungwook, Park : https://github.com/kyungw00k
// author : Jeeeyul Lee <jeeeyul@gmail.com>
var ko = {
    abbr: 'ko',
    months: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
    monthsShort: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
    weekdays: '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
    weekdaysShort: '일_월_화_수_목_금_토'.split('_'),
    weekdaysMin: '일_월_화_수_목_금_토'.split('_'),
    longDateFormat: {
        LT: 'A h:mm',
        LTS: 'A h:mm:ss',
        L: 'YYYY.MM.DD',
        LL: 'YYYY년 MMMM D일',
        LLL: 'YYYY년 MMMM D일 A h:mm',
        LLLL: 'YYYY년 MMMM D일 dddd A h:mm',
        l: 'YYYY.MM.DD',
        ll: 'YYYY년 MMMM D일',
        lll: 'YYYY년 MMMM D일 A h:mm',
        llll: 'YYYY년 MMMM D일 dddd A h:mm'
    },
    calendar: {
        sameDay: '오늘 LT',
        nextDay: '내일 LT',
        nextWeek: 'dddd LT',
        lastDay: '어제 LT',
        lastWeek: '지난주 dddd LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: '%s 후',
        past: '%s 전',
        s: '몇 초',
        ss: '%d초',
        m: '1분',
        mm: '%d분',
        h: '한 시간',
        hh: '%d시간',
        d: '하루',
        dd: '%d일',
        M: '한 달',
        MM: '%d달',
        y: '일 년',
        yy: '%d년'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(일|월|주)/,
    ordinal: function (num, period) {
        switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return num + "\uC77C";
            case 'M':
                return num + "\uC6D4";
            case 'w':
            case 'W':
                return num + "\uC8FC";
            default:
                return num.toString(10);
        }
    },
    meridiemParse: /오전|오후/,
    isPM: function (token) {
        return token === '오후';
    },
    meridiem: function (hour) {
        return hour < 12 ? '오전' : '오후';
    }
};

// moment.js locale configuration
// locale : Dutch [nl]
// author : Joris Röling : https://github.com/jorisroling
// author : Jacob Middag : https://github.com/middagj
// const monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
var monthsShort$3 = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');
var monthsParse$2 = [
    /^jan/i,
    /^feb/i,
    /^maart|mrt.?$/i,
    /^apr/i,
    /^mei$/i,
    /^jun[i.]?$/i,
    /^jul[i.]?$/i,
    /^aug/i,
    /^sep/i,
    /^okt/i,
    /^nov/i,
    /^dec/i
];
var monthsRegex$2 = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;
var nl = {
    abbr: 'nl',
    months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
    monthsShort: monthsShort$3,
    // monthsShort(date: Date, format: string): string {
    //   if (!date) {
    //     return monthsShortWithDots;
    //   } else if (/-MMM-/.test(format)) {
    //     return monthsShortWithoutDots[getMonth(date)];
    //   } else {
    //     return monthsShortWithDots[getMonth(date)];
    //   }
    // },
    monthsRegex: monthsRegex$2,
    monthsShortRegex: monthsRegex$2,
    monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
    monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,
    monthsParse: monthsParse$2,
    longMonthsParse: monthsParse$2,
    shortMonthsParse: monthsParse$2,
    weekdays: 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
    weekdaysShort: 'zo._ma._di._wo._do._vr._za.'.split('_'),
    weekdaysMin: 'zo_ma_di_wo_do_vr_za'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD-MM-YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[vandaag om] LT',
        nextDay: '[morgen om] LT',
        nextWeek: 'dddd [om] LT',
        lastDay: '[gisteren om] LT',
        lastWeek: '[afgelopen] dddd [om] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'over %s',
        past: '%s geleden',
        s: 'een paar seconden',
        m: 'één minuut',
        mm: '%d minuten',
        h: 'één uur',
        hh: '%d uur',
        d: 'één dag',
        dd: '%d dagen',
        M: 'één maand',
        MM: '%d maanden',
        y: 'één jaar',
        yy: '%d jaar'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    ordinal: function (num) {
        return num + (num === 1 || num === 8 || num >= 20 ? 'ste' : 'de');
    },
    week: {
        dow: 1,
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
};

// moment.js locale configuration
// locale : Dutch (Belgium) [nl-be]
// author : Joris Röling : https://github.com/jorisroling
// author : Jacob Middag : https://github.com/middagj
// const monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
var monthsShort$4 = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');
var monthsParse$3 = [
    /^jan/i,
    /^feb/i,
    /^maart|mrt.?$/i,
    /^apr/i,
    /^mei$/i,
    /^jun[i.]?$/i,
    /^jul[i.]?$/i,
    /^aug/i,
    /^sep/i,
    /^okt/i,
    /^nov/i,
    /^dec/i
];
// tslint:disable-next-line
var monthsRegex$3 = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;
var nlBe = {
    abbr: 'nl-be',
    months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
    monthsShort: monthsShort$4,
    // monthsShort(date: Date, format: string): string {
    //   if (!date) {
    //     return monthsShortWithDots;
    //   } else if (/-MMM-/.test(format)) {
    //     return monthsShortWithoutDots[getMonth(date)];
    //   } else {
    //     return monthsShortWithDots[getMonth(date)];
    //   }
    // },
    monthsRegex: monthsRegex$3,
    monthsShortRegex: monthsRegex$3,
    monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
    monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,
    monthsParse: monthsParse$3,
    longMonthsParse: monthsParse$3,
    shortMonthsParse: monthsParse$3,
    weekdays: 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
    weekdaysShort: 'zo._ma._di._wo._do._vr._za.'.split('_'),
    weekdaysMin: 'zo_ma_di_wo_do_vr_za'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[vandaag om] LT',
        nextDay: '[morgen om] LT',
        nextWeek: 'dddd [om] LT',
        lastDay: '[gisteren om] LT',
        lastWeek: '[afgelopen] dddd [om] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'over %s',
        past: '%s geleden',
        s: 'een paar seconden',
        m: 'één minuut',
        mm: '%d minuten',
        h: 'één uur',
        hh: '%d uur',
        d: 'één dag',
        dd: '%d dagen',
        M: 'één maand',
        MM: '%d maanden',
        y: 'één jaar',
        yy: '%d jaar'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
    ordinal: function (num) {
        var ending = num === 1 || num === 8 || num >= 20 ? 'ste' : 'de';
        return "" + num + ending;
    },
    week: {
        dow: 1,
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
};

// moment.js locale configuration
// locale : Polish [pl]
// author : Rafal Hirsz : https://github.com/evoL
var months$1 = 'styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień'.split('_');
// const monthsSubjective = 'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia'.split('_');
function plural$1(n) {
    return n % 10 < 5 && n % 10 > 1 && ~~(n / 10) % 10 !== 1;
}
function translate$1(num, withoutSuffix, key) {
    var result = num + " ";
    switch (key) {
        case 'm':
            return withoutSuffix ? 'minuta' : 'minutę';
        case 'mm':
            return result + (plural$1(num) ? 'minuty' : 'minut');
        case 'h':
            return withoutSuffix ? 'godzina' : 'godzinę';
        case 'hh':
            return result + (plural$1(num) ? 'godziny' : 'godzin');
        case 'MM':
            return result + (plural$1(num) ? 'miesiące' : 'miesięcy');
        case 'yy':
            return result + (plural$1(num) ? 'lata' : 'lat');
    }
}
var pl = {
    abbr: 'pl',
    months: months$1,
    // months(date: Date, format: string): string {
    //   if (!date) {
    //     return monthsNominative;
    //   } else if (format === '') {
    //     Hack: if format empty we know this is used to generate
    //     RegExp by moment. Give then back both valid forms of months
    //     in RegExp ready format.
    // return `(${monthsSubjective[getMonth(date)]}|${monthsNominative[getMonth(date)]})`;
    // } else if (/D MMMM/.test(format)) {
    //   return monthsSubjective[getMonth(date)];
    // } else {
    //   return monthsNominative[getMonth(date)];
    // }
    // },
    monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
    weekdays: 'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),
    weekdaysShort: 'ndz_pon_wt_śr_czw_pt_sob'.split('_'),
    weekdaysMin: 'Nd_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm'
    },
    relativeTime: {
        future: 'za %s',
        past: '%s temu',
        s: 'kilka sekund',
        m: translate$1,
        mm: translate$1,
        h: translate$1,
        hh: translate$1,
        d: '1 dzień',
        dd: '%d dni',
        M: 'miesiąc',
        MM: translate$1,
        y: 'rok',
        yy: translate$1
    },
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal: function (num) {
        return num + ".";
    },
    week: {
        dow: 1,
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
};

// moment.js locale configuration
// locale : Portuguese (Brazil) [pt-br]
// author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira
var ptBr = {
    abbr: 'pt-br',
    months: 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
    monthsShort: 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
    weekdays: 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
    weekdaysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
    weekdaysMin: 'Do_2ª_3ª_4ª_5ª_6ª_Sá'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D [de] MMMM [de] YYYY',
        LLL: 'D [de] MMMM [de] YYYY [às] HH:mm',
        LLLL: 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
    },
    relativeTime: {
        future: 'em %s',
        past: '%s atrás',
        s: 'poucos segundos',
        ss: '%d segundos',
        m: 'um minuto',
        mm: '%d minutos',
        h: 'uma hora',
        hh: '%d horas',
        d: 'um dia',
        dd: '%d dias',
        M: 'um mês',
        MM: '%d meses',
        y: 'um ano',
        yy: '%d anos'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal: function (num) {
        return num + "\u00BA";
    }
};

// moment.js locale configuration
// locale : Swedish [sv]
// author : Jens Alm : https://github.com/ulmus
var sv = {
    abbr: 'sv',
    months: 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
    monthsShort: 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
    weekdays: 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
    weekdaysShort: 'sön_mån_tis_ons_tor_fre_lör'.split('_'),
    weekdaysMin: 'sö_må_ti_on_to_fr_lö'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'YYYY-MM-DD',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY [kl.] HH:mm',
        LLLL: 'dddd D MMMM YYYY [kl.] HH:mm',
        lll: 'D MMM YYYY HH:mm',
        llll: 'ddd D MMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[Idag] LT',
        nextDay: '[Imorgon] LT',
        lastDay: '[Igår] LT',
        nextWeek: '[På] dddd LT',
        lastWeek: '[I] dddd[s] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'om %s',
        past: 'för %s sedan',
        s: 'några sekunder',
        m: 'en minut',
        mm: '%d minuter',
        h: 'en timme',
        hh: '%d timmar',
        d: 'en dag',
        dd: '%d dagar',
        M: 'en månad',
        MM: '%d månader',
        y: 'ett år',
        yy: '%d år'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(e|a)/,
    ordinal: function (number) {
        var b = number % 10, 
        // tslint:disable-next-line:no-bitwise
        output = (~~(number % 100 / 10) === 1) ? 'e' :
            (b === 1) ? 'a' :
                (b === 2) ? 'a' :
                    (b === 3) ? 'e' : 'e';
        return number + output;
    },
    week: {
        dow: 1,
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
};

// moment.js locale configuration
// locale : Russian [ru]
// author : Viktorminator : https://github.com/Viktorminator
// Author : Menelion Elensúle : https://github.com/Oire
// author : Коренберг Марк : https://github.com/socketpair
function plural$2(word, num) {
    var forms$$1 = word.split('_');
    return num % 10 === 1 && num % 100 !== 11
        ? forms$$1[0]
        : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
            ? forms$$1[1]
            : forms$$1[2];
}
function relativeTimeWithPlural(num, withoutSuffix, key) {
    var format = {
        mm: withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
        hh: 'час_часа_часов',
        dd: 'день_дня_дней',
        MM: 'месяц_месяца_месяцев',
        yy: 'год_года_лет'
    };
    if (key === 'm') {
        return withoutSuffix ? 'минута' : 'минуту';
    }
    else {
        return num + " " + plural$2(format[key], +num);
    }
}
var monthsParse$4 = [
    /^янв/i,
    /^фев/i,
    /^мар/i,
    /^апр/i,
    /^ма[йя]/i,
    /^июн/i,
    /^июл/i,
    /^авг/i,
    /^сен/i,
    /^окт/i,
    /^ноя/i,
    /^дек/i
];
// http://new.gramota.ru/spravka/rules/139-prop : § 103
// Сокращения месяцев: http://new.gramota.ru/spravka/buro/search-answer?s=242637
// CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
var ru = {
    abbr: 'ru',
    months: {
        format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_'),
        standalone: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_')
    },
    monthsShort: {
        // по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку ?
        format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split('_'),
        standalone: 'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_')
    },
    weekdays: {
        standalone: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
        format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_'),
        isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
    },
    weekdaysShort: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
    weekdaysMin: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
    monthsParse: monthsParse$4,
    longMonthsParse: monthsParse$4,
    shortMonthsParse: monthsParse$4,
    // полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
    monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
    // копия предыдущего
    monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
    // полные названия с падежами
    monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,
    // Выражение, которое соотвествует только сокращённым формам
    monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D MMMM YYYY г.',
        LLL: 'D MMMM YYYY г., HH:mm',
        LLLL: 'dddd, D MMMM YYYY г., HH:mm'
    },
    relativeTime: {
        future: 'через %s',
        past: '%s назад',
        s: 'несколько секунд',
        m: relativeTimeWithPlural,
        mm: relativeTimeWithPlural,
        h: 'час',
        hh: relativeTimeWithPlural,
        d: 'день',
        dd: relativeTimeWithPlural,
        M: 'месяц',
        MM: relativeTimeWithPlural,
        y: 'год',
        yy: relativeTimeWithPlural
    },
    meridiemParse: /ночи|утра|дня|вечера/i,
    isPM: function (input) {
        return /^(дня|вечера)$/.test(input);
    },
    meridiem: function (hour) {
        if (hour < 4) {
            return 'ночи';
        }
        else if (hour < 12) {
            return 'утра';
        }
        else if (hour < 17) {
            return 'дня';
        }
        else {
            return 'вечера';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
    ordinal: function (num, period) {
        switch (period) {
            case 'M':
            case 'd':
            case 'DDD':
                return num + "-\u0439";
            case 'D':
                return num + "-\u0433\u043E";
            case 'w':
            case 'W':
                return num + "-\u044F";
            default:
                return num.toString(10);
        }
    },
    week: {
        dow: 1,
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
};

// moment.js locale configuration
// locale : Chinese (China) [zh-cn]
// author : suupic : https://github.com/suupic
// author : Zeno Zeng : https://github.com/zenozeng
var zhCn = {
    abbr: 'zh-cn',
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'YYYY年MMMD日',
        LL: 'YYYY年MMMD日',
        LLL: 'YYYY年MMMD日Ah点mm分',
        LLLL: 'YYYY年MMMD日ddddAh点mm分',
        l: 'YYYY年MMMD日',
        ll: 'YYYY年MMMD日',
        lll: 'YYYY年MMMD日 HH:mm',
        llll: 'YYYY年MMMD日dddd HH:mm'
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour: function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
            return hour;
        }
        else if (meridiem === '下午' || meridiem === '晚上') {
            return hour + 12;
        }
        else {
            // '中午'
            return hour >= 11 ? hour : hour + 12;
        }
    },
    meridiem: function (hour, minute) {
        var hm = hour * 100 + minute;
        if (hm < 600) {
            return '凌晨';
        }
        else if (hm < 900) {
            return '早上';
        }
        else if (hm < 1130) {
            return '上午';
        }
        else if (hm < 1230) {
            return '中午';
        }
        else if (hm < 1800) {
            return '下午';
        }
        else {
            return '晚上';
        }
    },
    calendar: {
        sameDay: '[今天]LT',
        nextDay: '[明天]LT',
        nextWeek: '[下]ddddLT',
        lastDay: '[昨天]LT',
        lastWeek: '[上]ddddLT',
        sameElse: 'L'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
    ordinal: function (num, period) {
        switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return num + "\u65E5";
            case 'M':
                return num + "\u6708";
            case 'w':
            case 'W':
                return num + "\u5468";
            default:
                return num.toString(10);
        }
    },
    relativeTime: {
        future: '%s内',
        past: '%s前',
        s: '几秒',
        m: '1 分钟',
        mm: '%d 分钟',
        h: '1 小时',
        hh: '%d 小时',
        d: '1 天',
        dd: '%d 天',
        M: '1 个月',
        MM: '%d 个月',
        y: '1 年',
        yy: '%d 年'
    },
    week: {
        // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
        dow: 1,
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
};

// moment.js locale configuration
// locale : Turkish [tr]
// author : Umit Gündüz : https://github.com/umitgunduz
var tr = {
    abbr: 'tr',
    months: 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
    monthsShort: 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
    weekdays: 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
    weekdaysShort: 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
    weekdaysMin: 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd, D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[bugün saat] LT',
        nextDay: '[yarın saat] LT',
        nextWeek: '[haftaya] dddd [saat] LT',
        lastDay: '[dün] LT',
        lastWeek: '[geçen hafta] dddd [saat] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: '%s sonra',
        past: '%s önce',
        s: 'birkaç saniye',
        m: 'bir dakika',
        mm: '%d dakika',
        h: 'bir saat',
        hh: '%d saat',
        d: 'bir gün',
        dd: '%d gün',
        M: 'bir ay',
        MM: '%d ay',
        y: 'bir yıl',
        yy: '%d yıl'
    },
    dayOfMonthOrdinalParse: /\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,
    ordinal: function (num, token) {
        return num + ".";
    },
    week: {
        dow: 1,
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class EnumValue {
}
class Field {
    constructor() {
        this.name = null;
        this.classIdentifier = null;
        this.path = null;
        this.type = null;
        this.value = null;
        this.serviceObject = new Object();
        this.partOfMapping = false;
        this.partOfTransformation = false;
        this.visibleInCurrentDocumentSearch = true;
        this.selected = false;
        this.enumeration = false;
        this.enumValues = [];
        this.children = [];
        this.fieldDepth = 0;
        this.uuid = null;
        this.collapsed = true;
        this.hasUnmappedChildren = false;
        this.isCollection = false;
        this.isArray = false;
        this.isAttribute = false;
        this.isPrimitive = false;
        this.userCreated = false;
        this.docDef = null;
        this.namespaceAlias = null;
        this.uuid = Field.uuidCounter.toString();
        Field.uuidCounter++;
    }
    /**
     * @return {?}
     */
    getNameWithNamespace() {
        if (!this.docDef || !this.namespaceAlias) {
            return this.name;
        }
        return this.namespaceAlias + ':' + this.name;
    }
    /**
     * @return {?}
     */
    isParentField() {
        if (this.isCollection && !this.isPrimitive) {
            return true;
        }
        return (this.type == 'COMPLEX');
    }
    /**
     * @return {?}
     */
    isStringField() {
        return (this.type == 'STRING');
    }
    /**
     * @return {?}
     */
    isTerminal() {
        if (this.enumeration) {
            return true;
        }
        if (this.isCollection && !this.isPrimitive) {
            return false;
        }
        return (this.type != 'COMPLEX');
    }
    /**
     * @return {?}
     */
    copy() {
        const /** @type {?} */ copy = new Field();
        Object.assign(copy, this);
        //make these pointers to the same object, not copies
        copy.serviceObject = this.serviceObject;
        copy.parentField = this.parentField;
        copy.docDef = this.docDef;
        copy.children = [];
        for (const /** @type {?} */ childField of this.children) {
            copy.children.push(childField.copy());
        }
        //console.log("Copied: " + this.name, { "src": this, "target": copy });
        return copy;
    }
    /**
     * @param {?} that
     * @return {?}
     */
    copyFrom(that) {
        Object.assign(this, that);
        //make these pointers to the same object, not copies
        this.serviceObject = that.serviceObject;
        this.parentField = that.parentField;
        this.docDef = that.docDef;
        this.children = [];
        for (const /** @type {?} */ childField of that.children) {
            this.children.push(childField.copy());
        }
        //console.log("Copied: " + that.name, { "src": that, "target": this });
    }
    /**
     * @return {?}
     */
    getCollectionParentField() {
        let /** @type {?} */ parent = this;
        while (parent != null) {
            if (parent.isCollection) {
                return parent;
            }
            parent = parent.parentField;
        }
        return null;
    }
    /**
     * @return {?}
     */
    isInCollection() {
        return (this.getCollectionParentField() != null);
    }
    /**
     * @return {?}
     */
    isSource() {
        return (this.docDef != null) && this.docDef.isSource;
    }
    /**
     * @return {?}
     */
    getCollectionType() {
        return this.isCollection ? (this.isArray ? 'ARRAY' : 'LIST') : null;
    }
    /**
     * @param {?} includePath
     * @return {?}
     */
    getFieldLabel(includePath) {
        let /** @type {?} */ fieldPath = includePath ? this.path : this.getNameWithNamespace();
        if (this != DocumentDefinition.getNoneField() && ConfigModel.getConfig().showTypes && this.type && !this.isPropertyOrConstant()) {
            fieldPath = fieldPath + ' (' + this.type + ')';
        }
        if (this.isProperty() && this.value != null) {
            fieldPath += ' = ' + this.value;
        }
        return fieldPath;
    }
    /**
     * @return {?}
     */
    isPropertyOrConstant() {
        return (this.docDef == null) ? false : this.docDef.initCfg.type.isPropertyOrConstant();
    }
    /**
     * @return {?}
     */
    isProperty() {
        return (this.docDef == null) ? false : this.docDef.initCfg.type.isProperty();
    }
    /**
     * @return {?}
     */
    isConstant() {
        return (this.docDef == null) ? false : this.docDef.initCfg.type.isConstant();
    }
    /**
     * @param {?} field
     * @return {?}
     */
    static fieldHasUnmappedChild(field) {
        if (field == null) {
            return false;
        }
        if (field.isTerminal()) {
            return (field.partOfMapping == false);
        }
        for (const /** @type {?} */ childField of field.children) {
            if (childField.hasUnmappedChildren || Field.fieldHasUnmappedChild(childField)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} fields
     * @return {?}
     */
    static getFieldPaths(fields) {
        const /** @type {?} */ paths = [];
        for (const /** @type {?} */ field of fields) {
            paths.push(field.path);
        }
        return paths;
    }
    /**
     * @param {?} fields
     * @return {?}
     */
    static getFieldNames(fields) {
        const /** @type {?} */ paths = [];
        for (const /** @type {?} */ field of fields) {
            paths.push(field.name);
        }
        return paths;
    }
    /**
     * @param {?} fieldPath
     * @param {?} fields
     * @return {?}
     */
    static getField(fieldPath, fields) {
        for (const /** @type {?} */ field of fields) {
            if (fieldPath == field.path) {
                return field;
            }
        }
        return null;
    }
    /**
     * @param {?} fields
     * @return {?}
     */
    static alphabetizeFields(fields) {
        const /** @type {?} */ fieldsByName = {};
        const /** @type {?} */ fieldNames = [];
        for (const /** @type {?} */ field of fields) {
            let /** @type {?} */ name = field.name;
            const /** @type {?} */ firstCharacter = name.charAt(0).toUpperCase();
            name = firstCharacter + name.substring(1);
            field.displayName = name;
            //if field is a dupe, discard it
            if (fieldsByName[name] != null) {
                continue;
            }
            fieldsByName[name] = field;
            fieldNames.push(name);
        }
        fieldNames.sort();
        fields.length = 0;
        for (const /** @type {?} */ name of fieldNames) {
            fields.push(fieldsByName[name]);
        }
        for (const /** @type {?} */ field of fields) {
            if (field.children && field.children.length) {
                this.alphabetizeFields(field.children);
            }
        }
    }
}
Field.uuidCounter = 0;

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class DataMapperUtil {
    /**
     * @param {?} item
     * @param {?} items
     * @return {?}
     */
    static removeItemFromArray(item, items) {
        if (item == null || items == null || items.length == 0) {
            return false;
        }
        let /** @type {?} */ i = 0;
        let /** @type {?} */ itemWasRemoved = false;
        while (i < items.length) {
            if (items[i] == item) {
                items.splice(i, 1);
                itemWasRemoved = true;
            }
            else {
                i++;
            }
        }
        return itemWasRemoved;
    }
    /**
     * @param {?} object
     * @param {?} description
     * @param {?} loggingEnabled
     * @param {?} url
     * @return {?}
     */
    static debugLogJSON(object, description, loggingEnabled, url) {
        if (!loggingEnabled) {
            return;
        }
        object = (object == null) ? '[none]' : object;
        url = (url == null) ? '[none]' : url;
    }
    /**
     * @param {?} value
     * @param {?} fieldDescription
     * @return {?}
     */
    static isRequiredFieldValid(value, fieldDescription) {
        if (value == null || '' == value) {
            const /** @type {?} */ errorMessage = fieldDescription + ' is required.';
            ConfigModel.getConfig().errorService.validationError(errorMessage, null);
            return false;
        }
        return true;
    }
}

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class NamespaceModel {
    constructor() {
        this.alias = null;
        this.uri = null;
        this.locationUri = null;
        this.createdByUser = false;
        this.isTarget = false;
    }
    /**
     * @return {?}
     */
    static getUnqualifiedNamespace() {
        if (NamespaceModel.unqualifiedNamespace == null) {
            const /** @type {?} */ ns = new NamespaceModel();
            ns.alias = 'Unqualified';
            NamespaceModel.unqualifiedNamespace = ns;
        }
        return NamespaceModel.unqualifiedNamespace;
    }
    /**
     * @return {?}
     */
    getPrettyLabel() {
        if (this == NamespaceModel.getUnqualifiedNamespace()) {
            return this.alias;
        }
        return (this.isTarget ? 'Target' : this.alias)
            + ' [' + (this.uri == null ? 'NO URI' : this.uri) + ']';
    }
    /**
     * @return {?}
     */
    copy() {
        const /** @type {?} */ copy = new NamespaceModel();
        Object.assign(copy, this);
        return copy;
    }
    /**
     * @param {?} that
     * @return {?}
     */
    copyFrom(that) {
        Object.assign(this, that);
    }
}
NamespaceModel.unqualifiedNamespace = null;
let DocumentTypes = {};
DocumentTypes.JAVA = 0;
DocumentTypes.XML = 1;
DocumentTypes.JSON = 2;
DocumentTypes.CSV = 3;
DocumentTypes.CONSTANT = 4;
DocumentTypes.PROPERTY = 5;
DocumentTypes[DocumentTypes.JAVA] = "JAVA";
DocumentTypes[DocumentTypes.XML] = "XML";
DocumentTypes[DocumentTypes.JSON] = "JSON";
DocumentTypes[DocumentTypes.CSV] = "CSV";
DocumentTypes[DocumentTypes.CONSTANT] = "CONSTANT";
DocumentTypes[DocumentTypes.PROPERTY] = "PROPERTY";
class DocumentType {
    constructor() {
        this.type = DocumentTypes.JAVA;
    }
    /**
     * @return {?}
     */
    isJava() {
        return this.type == DocumentTypes.JAVA;
    }
    /**
     * @return {?}
     */
    isXML() {
        return this.type == DocumentTypes.XML;
    }
    /**
     * @return {?}
     */
    isJSON() {
        return this.type == DocumentTypes.JSON;
    }
    /**
     * @return {?}
     */
    isCSV() {
        return this.type == DocumentTypes.CSV;
    }
    /**
     * @return {?}
     */
    isConstant() {
        return this.type == DocumentTypes.CONSTANT;
    }
    /**
     * @return {?}
     */
    isProperty() {
        return this.type == DocumentTypes.PROPERTY;
    }
    /**
     * @return {?}
     */
    isPropertyOrConstant() {
        return this.isProperty() || this.isConstant();
    }
}
class DocumentInitializationConfig {
    constructor() {
        this.type = new DocumentType();
        this.initialized = false;
        this.errorOccurred = false;
        this.pathSeparator = '/';
        this.documentContents = null;
        this.inspectionResultContents = null;
        this.inspectionType = null;
    }
}
class DocumentDefinition {
    constructor() {
        this.initCfg = new DocumentInitializationConfig();
        this.fields = [];
        this.allFields = [];
        this.terminalFields = [];
        this.complexFieldsByClassIdentifier = {};
        this.enumFieldsByClassIdentifier = {};
        this.fieldsByPath = {};
        this.uri = null;
        this.fieldPaths = [];
        this.showFields = true;
        this.visibleInCurrentDocumentSearch = true;
        this.namespaces = [];
        this.characterEncoding = null;
        this.locale = null;
    }
    /**
     * @param {?} classIdentifier
     * @return {?}
     */
    getComplexField(classIdentifier) {
        return this.complexFieldsByClassIdentifier[classIdentifier];
    }
    /**
     * @param {?} classIdentifier
     * @return {?}
     */
    getEnumField(classIdentifier) {
        return this.enumFieldsByClassIdentifier[classIdentifier];
    }
    /**
     * @return {?}
     */
    getAllFields() {
        return [].concat(this.allFields);
    }
    /**
     * @return {?}
     */
    static getNoneField() {
        if (DocumentDefinition.noneField == null) {
            DocumentDefinition.noneField = new Field();
            DocumentDefinition.noneField.name = '[None]';
            DocumentDefinition.noneField.type = '';
            DocumentDefinition.noneField.displayName = '[None]';
            DocumentDefinition.noneField.path = '[None]';
        }
        return DocumentDefinition.noneField;
    }
    /**
     * @param {?} fields
     * @return {?}
     */
    isFieldsExist(fields) {
        if (fields == null || fields.length == 0) {
            return true;
        }
        const /** @type {?} */ foundFields = this.getFields(Field.getFieldPaths(fields));
        return (foundFields != null) && (fields.length == foundFields.length);
    }
    /**
     * @param {?} fieldPaths
     * @return {?}
     */
    getFields(fieldPaths) {
        const /** @type {?} */ fields = [];
        for (const /** @type {?} */ fieldPath of fieldPaths) {
            const /** @type {?} */ field = this.getField(fieldPath);
            if (field != null) {
                fields.push(field);
            }
        }
        return fields;
    }
    /**
     * @param {?} includeType
     * @return {?}
     */
    getName(includeType) {
        let /** @type {?} */ name = this.name;
        if (ConfigModel.getConfig().showTypes && !this.initCfg.type.isPropertyOrConstant()) {
            const /** @type {?} */ type = this.initCfg.type.isJava() ? ' (Java)' : ' (XML)';
            name += type;
        }
        return name;
    }
    /**
     * @param {?} alias
     * @return {?}
     */
    getNamespaceForAlias(alias) {
        for (const /** @type {?} */ ns of this.namespaces) {
            if (alias == ns.alias) {
                return ns;
            }
        }
        return null;
    }
    /**
     * @param {?} fieldPath
     * @return {?}
     */
    getField(fieldPath) {
        if (fieldPath == DocumentDefinition.getNoneField().path) {
            return DocumentDefinition.getNoneField();
        }
        if (fieldPath == null) {
            return null;
        }
        let /** @type {?} */ field = this.fieldsByPath[fieldPath];
        //if we can't find the field we're looking for, find parent fields and populate their children
        const /** @type {?} */ pathSeparator = this.initCfg.pathSeparator;
        let /** @type {?} */ originalPath = fieldPath;
        //strip beginning path separator from path
        if (originalPath != null && originalPath.indexOf(pathSeparator) == 0) {
            originalPath = originalPath.substring(1);
        }
        if (field == null && (originalPath.indexOf(pathSeparator) != -1)) {
            let /** @type {?} */ currentParentPath = '';
            while (originalPath.indexOf(pathSeparator) != -1) {
                const /** @type {?} */ currentPathSection = originalPath.substr(0, originalPath.indexOf(pathSeparator));
                currentParentPath += pathSeparator + currentPathSection;
                const /** @type {?} */ parentField = this.fieldsByPath[currentParentPath];
                if (parentField == null) {
                    throw new Error("Could not populate parent field with path '"
                        + currentParentPath + "' (for: " + fieldPath + ')');
                }
                this.populateChildren(parentField);
                if (originalPath.indexOf(pathSeparator) != -1) {
                    originalPath = originalPath.substr(originalPath.indexOf(pathSeparator) + 1);
                }
            }
            field = this.fieldsByPath[fieldPath];
        }
        return field;
    }
    /**
     * @return {?}
     */
    getTerminalFields() {
        return [].concat(this.terminalFields);
    }
    /**
     * @return {?}
     */
    clearSelectedFields() {
        for (const /** @type {?} */ field of this.allFields) {
            field.selected = false;
        }
    }
    /**
     * @return {?}
     */
    getSelectedFields() {
        const /** @type {?} */ fields = [];
        for (const /** @type {?} */ field of this.allFields) {
            if (field.selected) {
                fields.push(field);
            }
        }
        return fields;
    }
    /**
     * @param {?} fields
     * @return {?}
     */
    static selectFields(fields) {
        for (const /** @type {?} */ field of fields) {
            field.selected = true;
        }
    }
    /**
     * @return {?}
     */
    initializeFromFields() {
        if (this.initCfg.type.isJava()) {
            this.prepareComplexFields();
        }
        Field.alphabetizeFields(this.fields);
        for (const /** @type {?} */ field of this.fields) {
            this.populateFieldParentPaths(field, null, 0);
            this.populateFieldData(field);
        }
        this.fieldPaths.sort();
        if (ConfigModel.getConfig().initCfg.debugDocumentParsing) {
            let /** @type {?} */ enumFields = 'Enum fields:\n';
            for (const /** @type {?} */ field of this.allFields) {
                if (field.enumeration) {
                    enumFields += '\t' + field.path + ' (' + field.classIdentifier + ')\n';
                }
            }
        }
        this.initCfg.initialized = true;
    }
    /**
     * @param {?} field
     * @param {?} oldPath
     * @return {?}
     */
    updateField(field, oldPath) {
        Field.alphabetizeFields(this.fields);
        if (field.parentField == null
            || field.parentField == DocumentDefinition.getNoneField()
            || this.initCfg.type.isPropertyOrConstant()) {
            this.populateFieldParentPaths(field, null, 0);
        }
        else {
            const /** @type {?} */ pathSeparator = this.initCfg.pathSeparator;
            this.populateFieldParentPaths(field, field.parentField.path + pathSeparator, field.parentField.fieldDepth + 1);
        }
        if (oldPath != null && this.fieldsByPath[oldPath] != null) {
            delete (this.fieldsByPath[oldPath]);
        }
        DataMapperUtil.removeItemFromArray(field.path, this.fieldPaths);
        this.populateFieldData(field);
        this.fieldPaths.sort();
    }
    /**
     * @param {?} field
     * @return {?}
     */
    addField(field) {
        if (field.parentField == null
            || field.parentField == DocumentDefinition.getNoneField()
            || this.initCfg.type.isPropertyOrConstant()) {
            this.fields.push(field);
            Field.alphabetizeFields(this.fields);
            this.populateFieldParentPaths(field, null, 0);
        }
        else {
            this.populateChildren(field.parentField);
            field.parentField.children.push(field);
            Field.alphabetizeFields(field.parentField.children);
            const /** @type {?} */ pathSeparator = this.initCfg.pathSeparator;
            this.populateFieldParentPaths(field, field.parentField.path + pathSeparator, field.parentField.fieldDepth + 1);
        }
        this.populateFieldData(field);
        this.fieldPaths.sort();
    }
    /**
     * @param {?} field
     * @return {?}
     */
    populateChildren(field) {
        //populate complex fields
        if (field.isTerminal() || (field.children.length > 0)) {
            return;
        }
        let /** @type {?} */ cachedField = this.getComplexField(field.classIdentifier);
        if (cachedField == null) {
            return;
        }
        //copy cached field children
        cachedField = cachedField.copy();
        const /** @type {?} */ pathSeparator = this.initCfg.pathSeparator;
        for (let /** @type {?} */ childField of cachedField.children) {
            childField = childField.copy();
            childField.parentField = field;
            this.populateFieldParentPaths(childField, field.path + pathSeparator, field.fieldDepth + 1);
            this.populateFieldData(childField);
            field.children.push(childField);
        }
        this.fieldPaths.sort();
    }
    /**
     * @param {?} field
     * @return {?}
     */
    removeField(field) {
        if (field == null) {
            return;
        }
        DataMapperUtil.removeItemFromArray(field, this.fields);
        DataMapperUtil.removeItemFromArray(field, this.allFields);
        DataMapperUtil.removeItemFromArray(field, this.terminalFields);
        DataMapperUtil.removeItemFromArray(field.path, this.fieldPaths);
        delete (this.fieldsByPath[field.path]);
        if (field.parentField != null) {
            DataMapperUtil.removeItemFromArray(field, field.parentField.children);
        }
    }
    /**
     * @param {?} mappingDefinition
     * @param {?} cfg
     * @return {?}
     */
    updateFromMappings(mappingDefinition, cfg) {
        for (const /** @type {?} */ field of this.allFields) {
            field.partOfMapping = false;
            field.hasUnmappedChildren = false;
            field.selected = false;
            field.partOfTransformation = false;
        }
        //FIXME: some of this work is happening N times for N source/target docs, should only happen once.
        for (const /** @type {?} */ mapping of mappingDefinition.getAllMappings(true)) {
            const /** @type {?} */ mappingIsActive = (mapping == mappingDefinition.activeMapping);
            let /** @type {?} */ partOfTransformation = false;
            for (const /** @type {?} */ fieldPair of mapping.fieldMappings) {
                if (fieldPair.hasTransition()) {
                    partOfTransformation = true;
                    break;
                }
            }
            for (const /** @type {?} */ field of mapping.getAllFields()) {
                let /** @type {?} */ parentField = field;
                field.selected = mappingIsActive && field.isTerminal();
                while (parentField != null) {
                    parentField.partOfMapping = true;
                    parentField.partOfTransformation = parentField.partOfTransformation || partOfTransformation;
                    parentField = parentField.parentField;
                }
            }
        }
        for (const /** @type {?} */ field of this.allFields) {
            field.hasUnmappedChildren = Field.fieldHasUnmappedChild(field);
        }
    }
    /**
     * @param {?} documentIdentifier
     * @param {?} docs
     * @return {?}
     */
    static getDocumentByIdentifier(documentIdentifier, docs) {
        if (documentIdentifier == null || docs == null || !docs.length) {
            return null;
        }
        for (const /** @type {?} */ doc of docs) {
            if (doc.initCfg.documentIdentifier === documentIdentifier) {
                return doc;
            }
        }
        return null;
    }
    /**
     * @param {?} field
     * @param {?} parentPath
     * @param {?} depth
     * @return {?}
     */
    populateFieldParentPaths(field, parentPath, depth) {
        if (parentPath == null) {
            parentPath = this.initCfg.pathSeparator;
        }
        field.path = parentPath + field.getNameWithNamespace();
        if (field.isCollection) {
            field.path += field.isArray ? '[]' : '<>';
        }
        if (field.isAttribute) {
            field.path = parentPath += '@' + field.name;
        }
        if (field.serviceObject) {
            field.serviceObject.path = field.path;
        }
        field.fieldDepth = depth;
        const /** @type {?} */ pathSeparator = this.initCfg.pathSeparator;
        for (const /** @type {?} */ childField of field.children) {
            childField.parentField = field;
            this.populateFieldParentPaths(childField, field.path + pathSeparator, depth + 1);
        }
    }
    /**
     * @param {?} field
     * @return {?}
     */
    populateFieldData(field) {
        field.docDef = this;
        this.fieldPaths.push(field.path);
        this.allFields.push(field);
        this.fieldsByPath[field.path] = field;
        if (field.enumeration) {
            this.enumFieldsByClassIdentifier[field.classIdentifier] = field;
        }
        if (field.isTerminal()) {
            this.terminalFields.push(field);
        }
        else {
            for (const /** @type {?} */ childField of field.children) {
                this.populateFieldData(childField);
            }
        }
    }
    /**
     * @return {?}
     */
    prepareComplexFields() {
        const /** @type {?} */ fields = this.fields;
        //build complex field cache
        this.discoverComplexFields(fields);
        for (const /** @type {?} */ key in this.complexFieldsByClassIdentifier) {
            if (!this.complexFieldsByClassIdentifier.hasOwnProperty(key)) {
                continue;
            }
            const /** @type {?} */ cachedField = this.complexFieldsByClassIdentifier[key];
            //remove children more than one level deep in cached fields
            for (const /** @type {?} */ childField of cachedField.children) {
                childField.children = [];
            }
            //alphebatize complex field's childrein
            Field.alphabetizeFields(cachedField.children);
        }
        // print cached complex fields
        if (ConfigModel.getConfig().initCfg.debugDocumentParsing) {
            let /** @type {?} */ result = 'Cached Fields: ';
            for (const /** @type {?} */ key in this.complexFieldsByClassIdentifier) {
                if (!this.complexFieldsByClassIdentifier.hasOwnProperty(key)) {
                    continue;
                }
                const /** @type {?} */ cachedField = this.complexFieldsByClassIdentifier[key];
                result += cachedField.name + ' ' + cachedField.type + ' ' + cachedField.serviceObject.status
                    + ' (' + cachedField.classIdentifier + ') children:' + cachedField.children.length + '\n';
            }
        }
        //remove children more than one layer deep in root fields
        for (const /** @type {?} */ field of fields) {
            for (const /** @type {?} */ childField of field.children) {
                if (field.isCollection || childField.isCollection) {
                    continue;
                }
                childField.children = [];
            }
        }
    }
    /**
     * @param {?} fields
     * @return {?}
     */
    discoverComplexFields(fields) {
        for (const /** @type {?} */ field of fields) {
            if (field.type != 'COMPLEX') {
                continue;
            }
            if (field.serviceObject.status == 'SUPPORTED') {
                this.complexFieldsByClassIdentifier[field.classIdentifier] = field.copy();
            }
            if (field.children) {
                this.discoverComplexFields(field.children);
            }
        }
    }
    /**
     * @param {?} fields
     * @param {?} indent
     * @return {?}
     */
    printDocumentFields(fields, indent) {
        let /** @type {?} */ result = '';
        for (const /** @type {?} */ f of fields) {
            if (f.type != 'COMPLEX') {
                continue;
            }
            for (let /** @type {?} */ i = 0; i < indent; i++) {
                result += '\t';
            }
            result += f.name + ' ' + f.type + ' ' + f.serviceObject.status + ' (' + f.classIdentifier + ') children:' + f.children.length;
            result += '\n';
            if (f.children) {
                result += this.printDocumentFields(f.children, indent + 1);
            }
        }
        return result;
    }
}
DocumentDefinition.noneField = null;

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class DataMapperInitializationModel {
    constructor() {
        this.dataMapperVersion = '0.9.2017.07.28';
        this.initialized = false;
        this.loadingStatus = 'Loading.';
        this.initializationErrorOccurred = false;
        this.classPathFetchTimeoutInMilliseconds = 30000;
        this.fieldNameBlacklist = [];
        this.classNameBlacklist = [];
        this.disablePrivateOnlyFields = false;
        this.disableProtectedOnlyFields = false;
        this.disablePublicOnlyFields = false;
        this.disablePublicGetterSetterFields = false;
        this.discardNonMockSources = false;
        this.addMockJSONMappings = false;
        this.addMockJavaSingleSource = false;
        this.addMockJavaSources = false;
        this.addMockJavaCachedSource = false;
        this.addMockXMLInstanceSources = false;
        this.addMockXMLSchemaSources = false;
        this.addMockJSONSources = false;
        this.addMockJSONInstanceSources = false;
        this.addMockJSONSchemaSources = false;
        this.addMockJavaTarget = false;
        this.addMockJavaCachedTarget = false;
        this.addMockXMLInstanceTarget = false;
        this.addMockXMLSchemaTarget = false;
        this.addMockJSONTarget = false;
        this.addMockJSONInstanceTarget = false;
        this.addMockJSONSchemaTarget = false;
        this.debugDocumentServiceCalls = false;
        this.debugDocumentParsing = false;
        this.debugMappingServiceCalls = false;
        this.debugClassPathServiceCalls = false;
        this.debugValidationServiceCalls = false;
        this.debugFieldActionServiceCalls = false;
        this.mappingInitialized = false;
        this.fieldActionsInitialized = false;
    }
}
class ConfigModel {
    constructor() {
        this.initCfg = new DataMapperInitializationModel;
        this.showMappingDetailTray = false;
        this.showMappingTable = false;
        this.showNamespaceTable = false;
        this.showLinesAlways = true;
        this.showTypes = false;
        this.showMappedFields = true;
        this.showUnmappedFields = true;
        this.currentDraggedField = null;
        this.sourceDocs = [];
        this.targetDocs = [];
        this.propertyDoc = new DocumentDefinition();
        this.constantDoc = new DocumentDefinition();
        this.mappingFiles = [];
        this.mappings = null;
        this.errors = [];
        this.validationErrors = [];
        this.propertyDoc.initCfg.type.type = DocumentTypes.PROPERTY;
        this.propertyDoc.name = 'Properties';
        this.propertyDoc.isSource = true;
        this.constantDoc.initCfg.type.type = DocumentTypes.CONSTANT;
        this.constantDoc.name = 'Constants';
        this.constantDoc.isSource = true;
    }
    /**
     * @return {?}
     */
    static getConfig() {
        return ConfigModel.cfg;
    }
    /**
     * @param {?} cfg
     * @return {?}
     */
    static setConfig(cfg) {
        ConfigModel.cfg = cfg;
    }
    /**
     * @param {?} documentIdentifier
     * @param {?} isSource
     * @return {?}
     */
    addJavaDocument(documentIdentifier, isSource) {
        return this.createDocument(documentIdentifier, isSource, DocumentTypes.JAVA, null);
    }
    /**
     * @param {?} documentIdentifier
     * @param {?} documentContents
     * @param {?} isSource
     * @return {?}
     */
    addJSONDocument(documentIdentifier, documentContents, isSource) {
        return this.createDocument(documentIdentifier, isSource, DocumentTypes.JSON, documentContents);
    }
    /**
     * @param {?} documentIdentifier
     * @param {?} documentContents
     * @param {?} isSource
     * @return {?}
     */
    addJSONInstanceDocument(documentIdentifier, documentContents, isSource) {
        const /** @type {?} */ docDef = this.createDocument(documentIdentifier, isSource, DocumentTypes.JSON, documentContents);
        docDef.initCfg.inspectionType = 'INSTANCE';
        docDef.uri = 'atlas:json:' + documentIdentifier;
        return docDef;
    }
    /**
     * @param {?} documentIdentifier
     * @param {?} documentContents
     * @param {?} isSource
     * @return {?}
     */
    addJSONSchemaDocument(documentIdentifier, documentContents, isSource) {
        const /** @type {?} */ docDef = this.createDocument(documentIdentifier, isSource, DocumentTypes.JSON, documentContents);
        docDef.initCfg.inspectionType = 'SCHEMA';
        docDef.uri = 'atlas:json:' + documentIdentifier;
        return docDef;
    }
    /**
     * @param {?} documentIdentifier
     * @param {?} documentContents
     * @param {?} isSource
     * @return {?}
     */
    addXMLInstanceDocument(documentIdentifier, documentContents, isSource) {
        const /** @type {?} */ docDef = this.createDocument(documentIdentifier, isSource, DocumentTypes.XML, documentContents);
        docDef.initCfg.inspectionType = 'INSTANCE';
        docDef.uri = 'atlas:xml:' + documentIdentifier;
        return docDef;
    }
    /**
     * @param {?} documentIdentifier
     * @param {?} documentContents
     * @param {?} isSource
     * @return {?}
     */
    addXMLSchemaDocument(documentIdentifier, documentContents, isSource) {
        const /** @type {?} */ docDef = this.createDocument(documentIdentifier, isSource, DocumentTypes.XML, documentContents);
        docDef.initCfg.inspectionType = 'SCHEMA';
        docDef.uri = 'atlas:xml:' + documentIdentifier;
        return docDef;
    }
    /**
     * @param {?} isSource
     * @return {?}
     */
    getDocsWithoutPropertyDoc(isSource) {
        return [].concat(isSource ? this.sourceDocs : this.targetDocs);
    }
    /**
     * @param {?} isSource
     * @return {?}
     */
    getDocs(isSource) {
        const /** @type {?} */ docs = this.getDocsWithoutPropertyDoc(isSource);
        return isSource ? docs.concat([this.propertyDoc, this.constantDoc]) : docs;
    }
    /**
     * @return {?}
     */
    hasJavaDocuments() {
        for (const /** @type {?} */ doc of this.getAllDocs()) {
            if (doc.initCfg.type.isJava()) {
                return true;
            }
        }
        return false;
    }
    /**
     * @return {?}
     */
    isClassPathResolutionNeeded() {
        if (this.initCfg.classPath) {
            return false;
        }
        for (const /** @type {?} */ doc of this.getAllDocs()) {
            if (doc.initCfg.type.isJava() && doc.initCfg.inspectionResultContents == null) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} shortIdentifier
     * @param {?} isSource
     * @return {?}
     */
    getDocForShortIdentifier(shortIdentifier, isSource) {
        for (const /** @type {?} */ d of this.getDocs(isSource)) {
            if (d.initCfg.shortIdentifier == shortIdentifier) {
                return d;
            }
        }
        return null;
    }
    /**
     * @param {?} isSource
     * @return {?}
     */
    getFirstXmlDoc(isSource) {
        const /** @type {?} */ docs = this.getDocsWithoutPropertyDoc(isSource);
        for (const /** @type {?} */ doc of docs) {
            if (doc.initCfg.type.isXML()) {
                return doc;
            }
        }
        return null;
    }
    /**
     * @return {?}
     */
    getAllDocs() {
        return [this.propertyDoc, this.constantDoc].concat(this.sourceDocs).concat(this.targetDocs);
    }
    /**
     * @return {?}
     */
    documentsAreLoaded() {
        for (const /** @type {?} */ d of this.getAllDocs()) {
            if (!d.initCfg.initialized) {
                return false;
            }
        }
        return true;
    }
    /**
     * @param {?} documentIdentifier
     * @param {?} isSource
     * @param {?} docType
     * @param {?} documentContents
     * @return {?}
     */
    createDocument(documentIdentifier, isSource, docType, documentContents) {
        const /** @type {?} */ docDef = new DocumentDefinition();
        docDef.isSource = isSource;
        docDef.initCfg.documentIdentifier = documentIdentifier;
        docDef.initCfg.shortIdentifier = documentIdentifier;
        docDef.uri = documentIdentifier;
        docDef.name = documentIdentifier;
        docDef.initCfg.type.type = docType;
        docDef.initCfg.documentContents = documentContents;
        docDef.initCfg.inspectionType = 'INSTANCE';
        if (isSource) {
            this.sourceDocs.push(docDef);
        }
        else {
            this.targetDocs.push(docDef);
        }
        return docDef;
    }
}
ConfigModel.mappingServicesPackagePrefix = 'io.atlasmap.v2';
ConfigModel.javaServicesPackagePrefix = 'io.atlasmap.java.v2';
ConfigModel.cfg = new ConfigModel();

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class DocumentManagementService {
    /**
     * @param {?} http
     */
    constructor(http$$1) {
        this.http = http$$1;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }
    /**
     * @return {?}
     */
    initialize() {
        this.cfg.mappingService.mappingUpdated$.subscribe(mappingDefinition => {
            for (const /** @type {?} */ d of this.cfg.getAllDocs()) {
                if (d.initCfg.initialized) {
                    d.updateFromMappings(this.cfg.mappings, this.cfg);
                }
            }
        });
    }
    /**
     * @return {?}
     */
    fetchClassPath() {
        return new Observable$1((observer) => {
            const /** @type {?} */ requestBody = {
                'MavenClasspathRequest': {
                    'jsonType': ConfigModel.javaServicesPackagePrefix + '.MavenClasspathRequest',
                    'pomXmlData': this.cfg.initCfg.pomPayload,
                    'executeTimeout': this.cfg.initCfg.classPathFetchTimeoutInMilliseconds,
                },
            };
            const /** @type {?} */ url = this.cfg.initCfg.baseJavaInspectionServiceUrl + 'mavenclasspath';
            DataMapperUtil.debugLogJSON(requestBody, 'Classpath Service Request', this.cfg.initCfg.debugClassPathServiceCalls, url);
            this.http.post(url, requestBody, { headers: this.headers }).toPromise()
                .then((res) => {
                const /** @type {?} */ body = res.json();
                DataMapperUtil.debugLogJSON(body, 'Classpath Service Response', this.cfg.initCfg.debugClassPathServiceCalls, url);
                const /** @type {?} */ classPath = body.MavenClasspathResponse.classpath;
                observer.next(classPath);
                observer.complete();
            })
                .catch((error) => {
                observer.error(error);
                observer.complete();
            });
        });
    }
    /**
     * @param {?} docDef
     * @param {?} classPath
     * @return {?}
     */
    fetchDocument(docDef, classPath) {
        return new Observable$1((observer) => {
            if (docDef.initCfg.inspectionResultContents != null) {
                const /** @type {?} */ responseJson = JSON.parse(docDef.initCfg.inspectionResultContents);
                this.parseDocumentResponse(responseJson, docDef);
                observer.next(docDef);
                observer.complete();
                return;
            }
            const /** @type {?} */ payload = this.createDocumentFetchRequest(docDef, classPath);
            let /** @type {?} */ url = this.cfg.initCfg.baseJavaInspectionServiceUrl + 'class';
            if (docDef.initCfg.type.isXML()) {
                url = this.cfg.initCfg.baseXMLInspectionServiceUrl + 'inspect';
            }
            if (docDef.initCfg.type.isJSON()) {
                url = this.cfg.initCfg.baseJSONInspectionServiceUrl + 'inspect';
            }
            DataMapperUtil.debugLogJSON(payload, 'Document Service Request', this.cfg.initCfg.debugDocumentServiceCalls, url);
            this.http.post(url, payload, { headers: this.headers }).toPromise()
                .then((res) => {
                const /** @type {?} */ responseJson = res.json();
                DataMapperUtil.debugLogJSON(responseJson, 'Document Service Response', this.cfg.initCfg.debugDocumentServiceCalls, url);
                this.parseDocumentResponse(responseJson, docDef);
                observer.next(docDef);
                observer.complete();
            })
                .catch((error) => {
                observer.error(error);
                docDef.initCfg.errorOccurred = true;
                observer.next(docDef);
                observer.complete();
            });
        });
    }
    /**
     * @param {?} docDef
     * @param {?} classPath
     * @return {?}
     */
    createDocumentFetchRequest(docDef, classPath) {
        if (docDef.initCfg.type.isXML()) {
            return {
                'XmlInspectionRequest': {
                    'jsonType': 'io.atlasmap.xml.v2.XmlInspectionRequest',
                    'type': docDef.initCfg.inspectionType,
                    'xmlData': docDef.initCfg.documentContents,
                },
            };
        }
        if (docDef.initCfg.type.isJSON()) {
            return {
                'JsonInspectionRequest': {
                    'jsonType': 'io.atlasmap.json.v2.JsonInspectionRequest',
                    'type': docDef.initCfg.inspectionType,
                    'jsonData': docDef.initCfg.documentContents,
                },
            };
        }
        const /** @type {?} */ className = docDef.initCfg.documentIdentifier;
        const /** @type {?} */ payload = {
            'ClassInspectionRequest': {
                'jsonType': ConfigModel.javaServicesPackagePrefix + '.ClassInspectionRequest',
                'classpath': classPath,
                'className': className,
                'disablePrivateOnlyFields': this.cfg.initCfg.disablePrivateOnlyFields,
                'disableProtectedOnlyFields': this.cfg.initCfg.disableProtectedOnlyFields,
                'disablePublicOnlyFields': this.cfg.initCfg.disablePublicOnlyFields,
                'disablePublicGetterSetterFields': this.cfg.initCfg.disablePublicGetterSetterFields,
            },
        };
        if (this.cfg.initCfg.fieldNameBlacklist && this.cfg.initCfg.fieldNameBlacklist.length) {
            payload['ClassInspectionRequest']['fieldNameBlacklist'] = { 'string': this.cfg.initCfg.fieldNameBlacklist };
        }
        if (this.cfg.initCfg.classNameBlacklist && this.cfg.initCfg.classNameBlacklist.length) {
            payload['ClassInspectionRequest']['classNameBlacklist'] = { 'string': this.cfg.initCfg.classNameBlacklist };
        }
        return payload;
    }
    /**
     * @param {?} responseJson
     * @param {?} docDef
     * @return {?}
     */
    parseDocumentResponse(responseJson, docDef) {
        docDef.name = docDef.initCfg.shortIdentifier;
        docDef.fullyQualifiedName = docDef.initCfg.shortIdentifier;
        if (docDef.initCfg.type.isJava()) {
            if (typeof responseJson.ClassInspectionResponse != 'undefined') {
                this.extractJavaDocumentDefinitionFromInspectionResponse(responseJson, docDef);
            }
            else if ((typeof responseJson.javaClass != 'undefined')
                || (typeof responseJson.JavaClass != 'undefined')) {
                this.extractJavaDocumentDefinition(responseJson, docDef);
            }
            else {
                this.handleError('Unknown Java inspection result format', responseJson);
            }
        }
        else if (docDef.initCfg.type.isJSON()) {
            if (typeof responseJson.JsonInspectionResponse != 'undefined') {
                this.extractJSONDocumentDefinitionFromInspectionResponse(responseJson, docDef);
            }
            else if ((typeof responseJson.jsonDocument != 'undefined')
                || (typeof responseJson.JsonDocument != 'undefined')) {
                this.extractJSONDocumentDefinition(responseJson, docDef);
            }
            else {
                this.handleError('Unknown JSON inspection result format', responseJson);
            }
        }
        else {
            if (typeof responseJson.XmlInspectionResponse != 'undefined') {
                this.extractXMLDocumentDefinitionFromInspectionResponse(responseJson, docDef);
            }
            else if ((typeof responseJson.xmlDocument != 'undefined')
                || (typeof responseJson.XmlDocument != 'undefined')) {
                this.extractXMLDocumentDefinition(responseJson, docDef);
            }
            else {
                this.handleError('Unknown XML inspection result format', responseJson);
            }
        }
        docDef.initializeFromFields();
    }
    /**
     * @param {?} responseJson
     * @param {?} docDef
     * @return {?}
     */
    extractJSONDocumentDefinitionFromInspectionResponse(responseJson, docDef) {
        const /** @type {?} */ body = responseJson.JsonInspectionResponse;
        if (body.errorMessage) {
            this.handleError('Could not load JSON document, error: ' + body.errorMessage, null);
            docDef.initCfg.errorOccurred = true;
            return;
        }
        this.extractJSONDocumentDefinition(body, docDef);
    }
    /**
     * @param {?} body
     * @param {?} docDef
     * @return {?}
     */
    extractJSONDocumentDefinition(body, docDef) {
        let /** @type {?} */ jsonDocument;
        if (typeof body.jsonDocument != 'undefined') {
            jsonDocument = body.jsonDocument;
        }
        else {
            jsonDocument = body.JsonDocument;
        }
        docDef.characterEncoding = jsonDocument.characterEncoding;
        docDef.locale = jsonDocument.locale;
        for (const /** @type {?} */ field of jsonDocument.fields.field) {
            this.parseJSONFieldFromDocument(field, null, docDef);
        }
    }
    /**
     * @param {?} responseJson
     * @param {?} docDef
     * @return {?}
     */
    extractXMLDocumentDefinitionFromInspectionResponse(responseJson, docDef) {
        const /** @type {?} */ body = responseJson.XmlInspectionResponse;
        if (body.errorMessage) {
            this.handleError('Could not load XML document, error: ' + body.errorMessage, null);
            docDef.initCfg.errorOccurred = true;
            return;
        }
        this.extractXMLDocumentDefinition(body, docDef);
    }
    /**
     * @param {?} body
     * @param {?} docDef
     * @return {?}
     */
    extractXMLDocumentDefinition(body, docDef) {
        let /** @type {?} */ xmlDocument;
        if (typeof body.xmlDocument != 'undefined') {
            xmlDocument = body.xmlDocument;
        }
        else {
            xmlDocument = body.XmlDocument;
        }
        docDef.characterEncoding = xmlDocument.characterEncoding;
        docDef.locale = xmlDocument.locale;
        if (xmlDocument.xmlNamespaces && xmlDocument.xmlNamespaces.xmlNamespace
            && xmlDocument.xmlNamespaces.xmlNamespace.length) {
            for (const /** @type {?} */ serviceNS of xmlDocument.xmlNamespaces.xmlNamespace) {
                const /** @type {?} */ ns = new NamespaceModel();
                ns.alias = serviceNS.alias;
                ns.uri = serviceNS.uri;
                ns.locationUri = serviceNS.locationUri;
                ns.isTarget = serviceNS.targetNamespace;
                docDef.namespaces.push(ns);
            }
        }
        for (const /** @type {?} */ field of xmlDocument.fields.field) {
            this.parseXMLFieldFromDocument(field, null, docDef);
        }
    }
    /**
     * @param {?} responseJson
     * @param {?} docDef
     * @return {?}
     */
    extractJavaDocumentDefinitionFromInspectionResponse(responseJson, docDef) {
        const /** @type {?} */ body = responseJson.ClassInspectionResponse;
        if (body.errorMessage) {
            this.handleError('Could not load Java document, error: ' + body.errorMessage, null);
            docDef.initCfg.errorOccurred = true;
            return;
        }
        this.extractJavaDocumentDefinition(body, docDef);
    }
    /**
     * @param {?} body
     * @param {?} docDef
     * @return {?}
     */
    extractJavaDocumentDefinition(body, docDef) {
        let /** @type {?} */ javaClass;
        if (typeof body.javaClass != 'undefined') {
            javaClass = body.javaClass;
        }
        else {
            javaClass = body.JavaClass;
        }
        if (javaClass.status == 'NOT_FOUND') {
            const /** @type {?} */ docIdentifier = docDef.initCfg.documentIdentifier;
            this.handleError('Could not load JAVA document. Document is not found: ' + docIdentifier, null);
            docDef.initCfg.errorOccurred = true;
            return;
        }
        docDef.name = javaClass.className;
        //Make doc name the class name rather than fully qualified name
        if (docDef.name && docDef.name.indexOf('.') != -1) {
            docDef.name = docDef.name.substr(docDef.name.lastIndexOf('.') + 1);
        }
        docDef.fullyQualifiedName = javaClass.className;
        if (docDef.name == null) {
            this.cfg.errorService.error("Document's className is empty.", javaClass);
        }
        docDef.uri = javaClass.uri;
        docDef.characterEncoding = javaClass.characterEncoding;
        docDef.locale = javaClass.locale;
        for (const /** @type {?} */ field of javaClass.javaFields.javaField) {
            this.parseJavaFieldFromDocument(field, null, docDef);
        }
    }
    /**
     * @param {?} field
     * @param {?} parentField
     * @param {?} docDef
     * @return {?}
     */
    parseJSONFieldFromDocument(field, parentField, docDef) {
        const /** @type {?} */ parsedField = this.parseFieldFromDocument(field, parentField, docDef);
        if (parsedField == null) {
            return;
        }
        if (field.jsonFields && field.jsonFields.jsonField && field.jsonFields.jsonField.length) {
            for (const /** @type {?} */ childField of field.jsonFields.jsonField) {
                this.parseJSONFieldFromDocument(childField, parsedField, docDef);
            }
        }
    }
    /**
     * @param {?} field
     * @param {?} parentField
     * @param {?} docDef
     * @return {?}
     */
    parseFieldFromDocument(field, parentField, docDef) {
        if (field != null && field.status == 'NOT_FOUND') {
            this.cfg.errorService.warn('Ignoring unknown field: ' + field.name
                + ' (' + field.className + '), parent class: ' + docDef.name, null);
            return null;
        }
        else if (field != null && field.status == 'BLACK_LIST') {
            return null;
        }
        const /** @type {?} */ parsedField = new Field();
        parsedField.name = field.name;
        parsedField.type = field.fieldType;
        parsedField.path = field.path;
        parsedField.isPrimitive = field.fieldType != 'COMPLEX';
        parsedField.serviceObject = field;
        if ('LIST' == field.collectionType || 'ARRAY' == field.collectionType) {
            parsedField.isCollection = true;
            if ('ARRAY' == field.collectionType) {
                parsedField.isArray = true;
                parsedField.type = 'ARRAY[' + parsedField.type + ']';
            }
            else {
                parsedField.type = 'LIST<' + parsedField.type + '>';
            }
        }
        if (parentField != null) {
            parentField.children.push(parsedField);
        }
        else {
            docDef.fields.push(parsedField);
        }
        return parsedField;
    }
    /**
     * @param {?} field
     * @param {?} parentField
     * @param {?} docDef
     * @return {?}
     */
    parseXMLFieldFromDocument(field, parentField, docDef) {
        const /** @type {?} */ parsedField = this.parseFieldFromDocument(field, parentField, docDef);
        if (parsedField == null) {
            return;
        }
        if (field.name.indexOf(':') != -1) {
            parsedField.namespaceAlias = field.name.split(':')[0];
            parsedField.name = field.name.split(':')[1];
        }
        parsedField.isAttribute = (parsedField.path.indexOf('@') != -1);
        if (field.xmlFields && field.xmlFields.xmlField && field.xmlFields.xmlField.length) {
            for (const /** @type {?} */ childField of field.xmlFields.xmlField) {
                this.parseXMLFieldFromDocument(childField, parsedField, docDef);
            }
        }
    }
    /**
     * @param {?} field
     * @param {?} parentField
     * @param {?} docDef
     * @return {?}
     */
    parseJavaFieldFromDocument(field, parentField, docDef) {
        const /** @type {?} */ parsedField = this.parseFieldFromDocument(field, parentField, docDef);
        if (parsedField == null) {
            return;
        }
        //java fields have a special primitive property, so override the "!= COMPLEX" math from parseFieldFromDocument()
        parsedField.isPrimitive = field.primitive;
        parsedField.classIdentifier = field.className;
        parsedField.enumeration = field.enumeration;
        if (parsedField.enumeration && field.javaEnumFields && field.javaEnumFields.javaEnumField) {
            for (const /** @type {?} */ enumValue of field.javaEnumFields.javaEnumField) {
                const /** @type {?} */ parsedEnumValue = new EnumValue();
                parsedEnumValue.name = enumValue.name;
                parsedEnumValue.ordinal = enumValue.ordinal;
                parsedField.enumValues.push(parsedEnumValue);
            }
        }
        if (field.javaFields && field.javaFields.javaField && field.javaFields.javaField.length) {
            for (const /** @type {?} */ childField of field.javaFields.javaField) {
                this.parseJavaFieldFromDocument(childField, parsedField, docDef);
            }
        }
    }
    /**
     * @return {?}
     */
    static generateMockInstanceXMLDoc() {
        // here we have a bunch of examples we can use.
        let /** @type {?} */ mockDoc = `<data>
                <intField a='1'>32000</intField><longField>12421</longField>
                <stringField>abc</stringField><booleanField>true</booleanField>
                <doubleField b='2'>12.0</doubleField><shortField>1000</shortField>
                <floatField>234.5f</floatField><charField>A</charField>
                <outer><inner><value>val</value></inner></outer>
            </data>
        `;
        mockDoc = `<?xml version="1.0" encoding="UTF-8" ?>
            <foo>bar</foo>
        `;
        mockDoc = '<foo>bar</foo>';
        mockDoc = `
            <XMLOrder>
            <orderId>orderId</orderId>
            <Address>
                <addressLine1>addressLine1</addressLine1>
                <addressLine2>addressLine2</addressLine2>
                <city>city</city>
                <state>state</state>
                <zipCode>zipCode</zipCode>
            </Address>
            <Contact>
                <firstName>firstName</firstName>
                <lastName>lastName</lastName>
                <phoneNumber>phoneNumber</phoneNumber>
                <zipCode>zipCode</zipCode>
            </Contact>
            </XMLOrder>
        `;
        mockDoc = `
            <foo><bar><jason>somevalue</jason></bar></foo>
        `;
        mockDoc = `
            <orders totalCost="12525.00" xmlns="http://www.example.com/x/"
                xmlns:y="http://www.example.com/y/"
                xmlns:q="http://www.example.com/q/">
                <order>
                <id y:custId="a">12312</id>
                    <id y:custId="b">4423423</id>
                    </order>
                <q:order><id y:custId="x">12312</id></q:order>
                <order><id y:custId="c">54554555</id></order>
                <q:order><id y:custId="a">12312</id></q:order>
            </orders>
        `;
        mockDoc = `
            <ns:XmlFPE targetNamespace="http://atlasmap.io/xml/test/v2"
                xmlns:ns="http://atlasmap.io/xml/test/v2"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://atlasmap.io/xml/test/v2 atlas-xml-test-model-v2.xsd ">
                <booleanField>false</booleanField>
                <byteField>99</byteField>
                <charField>a</charField>
                <doubleField>50000000.0</doubleField>
                <floatField>40000000.0</floatField>
                <intField>2</intField>
                <longField>30000</longField>
                <shortField>1</shortField>
            </ns:XmlFPE>
        `;
        mockDoc = `
            <ns:XmlOE xmlns:ns="http://atlasmap.io/xml/test/v2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://atlasmap.io/xml/test/v2 atlas-xml-test-model-v2.xsd ">
            <ns:orderId>ns:orderId</ns:orderId>
            <ns:Address>
                <ns:addressLine1>ns:addressLine1</ns:addressLine1>
                <ns:addressLine2>ns:addressLine2</ns:addressLine2>
                <ns:city>ns:city</ns:city>
                <ns:state>ns:state</ns:state>
                <ns:zipCode>ns:zipCode</ns:zipCode>
            </ns:Address>
            <ns:Contact>
                <ns:firstName>ns:firstName</ns:firstName>
                <ns:lastName>ns:lastName</ns:lastName>
                <ns:phoneNumber>ns:phoneNumber</ns:phoneNumber>
                <ns:zipCode>ns:zipCode</ns:zipCode>
            </ns:Contact>
            </ns:XmlOE>
        `;
        return mockDoc;
    }
    /**
     * @return {?}
     */
    static generateMockSchemaXMLDoc() {
        let /** @type {?} */ mockDoc = `
            <xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified"
                     xmlns:xs="http://www.w3.org/2001/XMLSchema">
                <xs:element name="data">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element type="xs:short" name="intField"/>
                            <xs:element type="xs:short" name="longField"/>
                            <xs:element type="xs:string" name="stringField"/>
                            <xs:element type="xs:string" name="booleanField"/>
                            <xs:element type="xs:float" name="doubleField"/>
                            <xs:element type="xs:short" name="shortField"/>
                            <xs:element type="xs:string" name="floatField"/>
                            <xs:element type="xs:string" name="charField"/>
                        </xs:sequence>
                        <xs:attribute name="intAttr" type="xs:int" use="optional" default="1"/>
                    </xs:complexType>
                </xs:element>
            </xs:schema>
        `;
        mockDoc = `
            <schema xmlns="http://www.w3.org/2001/XMLSchema" targetNamespace="http://example.com/"
                xmlns:tns="http://example.com/">
                <element name="aGlobalElement" type="tns:aGlobalType"/>
                <simpleType name="aGlobalType"><restriction base="string"/></simpleType>
            </schema>
        `;
        mockDoc = `
            <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
                <xs:element name="shiporder">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="orderperson" type="xs:string"/>
                            <xs:element name="shipto">
                                <xs:complexType>
                                    <xs:sequence>
                                        <xs:element name="name" type="xs:string"/>
                                        <xs:element name="address" type="xs:string"/>
                                        <xs:element name="city" type="xs:string"/>
                                        <xs:element name="country" type="xs:string"/>
                                    </xs:sequence>
                                </xs:complexType>
                            </xs:element>
                            <xs:element name="item" maxOccurs="unbounded">
                                <xs:complexType>
                                    <xs:sequence>
                                        <xs:element name="title" type="xs:string"/>
                                        <xs:element name="note" type="xs:string" minOccurs="0"/>
                                        <xs:element name="quantity" type="xs:positiveInteger"/>
                                        <xs:element name="price" type="xs:decimal"/>
                                    </xs:sequence>
                                </xs:complexType>
                            </xs:element>
                        </xs:sequence>
                        <xs:attribute name="orderid" type="xs:string" use="required" fixed="2"/>
                    </xs:complexType>
                </xs:element>
            </xs:schema>
        `;
        mockDoc = `
            <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
                <xs:element name="shiporder">
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="shipto">
                                <xs:complexType>
                                    <xs:sequence>
                                        <xs:element name="name" type="xs:string"/>
                                    </xs:sequence>
                                </xs:complexType>
                            </xs:element>
                            <xs:element name="item" maxOccurs="unbounded">
                                <xs:complexType>
                                    <xs:sequence>
                                        <xs:element name="title" type="xs:string"/>
                                    </xs:sequence>
                                </xs:complexType>
                            </xs:element>
                        </xs:sequence>
                    </xs:complexType>
                </xs:element>
            </xs:schema>
        `;
        return mockDoc;
    }
    /**
     * @return {?}
     */
    static generateMockJSONDoc() {
        return DocumentManagementService.generateMockJSONInstanceDoc();
    }
    /**
     * @return {?}
     */
    static generateMockJSONInstanceDoc() {
        const /** @type {?} */ mockDoc = `   {
                "order": {
                    "address": {
                        "street": "123 any st",
                        "city": "Austin",
                        "state": "TX",
                        "zip": "78626"
                    },
                    "contact": {
                        "firstName": "james",
                        "lastName": "smith",
                        "phone": "512-123-1234"
                    },
                    "orderId": "123"
                },
                "primitives": {
                    "stringPrimitive": "some value",
                    "booleanPrimitive": true,
                    "numberPrimitive": 24
                },
                "addressList": [
                    { "street": "123 any st", "city": "Austin", "state": "TX", "zip": "78626" },
                    { "street": "123 any st", "city": "Austin", "state": "TX", "zip": "78626" },
                    { "street": "123 any st", "city": "Austin", "state": "TX", "zip": "78626" },
                    { "street": "123 any st", "city": "Austin", "state": "TX", "zip": "78626" }
                ]
            }
        `;
        return mockDoc;
    }
    /**
     * @return {?}
     */
    static generateMockJSONSchemaDoc() {
        const /** @type {?} */ mockDoc = `
            {
                "$schema": "http://json-schema.org/schema#",
                "description": "Order",
                "type": "object",
                "properties": {
                    "order": {
                        "type": "object",
                        "properties": {
                            "address": {
                                "type": "object",
                                "properties": {
                                    "street": { "type": "string" },
                                    "city": { "type": "string" },
                                    "state": { "type": "string" },
                                    "zip": { "type": "string" }
                                }
                            },
                            "contact": {
                                "type": "object",
                                "properties": {
                                    "firstName": { "type": "string" },
                                    "lastName": { "type": "string" },
                                    "phone": { "type": "string" }
                                }
                            },
                            "orderId": { "type": "string" }
                        }
                    },
                    "primitives": {
                        "type": "object",
                        "properties": {
                            "stringPrimitive": { "type": "string" },
                            "booleanPrimitive": { "type": "boolean" },
                            "numberPrimitive": { "type": "number" }
                        }
                    },
                    "primitiveArrays": {
                        "type": "object",
                        "properties": {
                            "stringArray": {
                                "type": "array",
                                "items": { "type": "string" }
                            },
                            "booleanArray": {
                                "type": "array",
                                "items": { "type": "boolean" }
                            },
                            "numberArray": {
                                "type": "array",
                                "items": { "type": "number" }
                            }
                        }
                    },
                    "addressList": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "street": { "type": "string" },
                                "city": { "type": "string" },
                                "state": { "type": "string" },
                                "zip": { "type": "string" }
                            }
                        }
                    }
                }
            }
        `;
        return mockDoc;
    }
    /**
     * @return {?}
     */
    static generateMockJavaDoc() {
        const /** @type {?} */ mockDoc = `
            {
              "JavaClass": {
                "jsonType": "io.atlasmap.java.v2.JavaClass",
                "modifiers": { "modifier": [ "PUBLIC" ] },
                "className": "io.atlasmap.java.test.Name",
                "primitive": false,
                "synthetic": false,
                "javaEnumFields": { "javaEnumField": [] },
                "javaFields": {
                  "javaField": [
                    {
                      "jsonType": "io.atlasmap.java.v2.JavaField",
                      "path": "firstName",
                      "status": "SUPPORTED",
                      "fieldType": "STRING",
                      "modifiers": { "modifier": [ "PRIVATE" ] },
                      "name": "firstName",
                      "className": "java.lang.String",
                      "getMethod": "getFirstName",
                      "setMethod": "setFirstName",
                      "primitive": true,
                      "synthetic": false
                    },
                    {
                      "jsonType": "io.atlasmap.java.v2.JavaField",
                      "path": "lastName",
                      "status": "SUPPORTED",
                      "fieldType": "STRING",
                      "modifiers": { "modifier": [ "PRIVATE" ] },
                      "name": "lastName",
                      "className": "java.lang.String",
                      "getMethod": "getLastName",
                      "setMethod": "setLastName",
                      "primitive": true,
                      "synthetic": false
                    }
                  ]
                },
                "packageName": "io.atlasmap.java.test",
                "annotation": false,
                "annonymous": false,
                "enumeration": false,
                "localClass": false,
                "memberClass": false,
                "uri": "atlas:java?className=io.atlasmap.java.test.Name",
                "interface": false
              }
            }
        `;
        return mockDoc;
    }
    /**
     * @param {?} message
     * @param {?} error
     * @return {?}
     */
    handleError(message, error) {
        this.cfg.errorService.error(message, error);
    }
}
DocumentManagementService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DocumentManagementService.ctorParameters = () => [
    { type: Http, },
];

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class FieldActionArgument {
    constructor() {
        this.name = null;
        this.type = 'STRING';
        this.serviceObject = new Object();
    }
}
class FieldActionArgumentValue {
    constructor() {
        this.name = null;
        this.value = null;
    }
}
class FieldAction {
    constructor() {
        this.isSeparateOrCombineMode = false;
        this.config = null;
        this.argumentValues = [];
    }
    /**
     * @param {?} argumentName
     * @return {?}
     */
    getArgumentValue(argumentName) {
        for (const /** @type {?} */ argValue of this.argumentValues) {
            if (argValue.name == argumentName) {
                return argValue;
            }
        }
        const /** @type {?} */ newArgValue = new FieldActionArgumentValue();
        newArgValue.name = argumentName;
        newArgValue.value = '0';
        this.argumentValues.push(newArgValue);
        return newArgValue;
    }
    /**
     * @param {?} argumentName
     * @param {?} value
     * @return {?}
     */
    setArgumentValue(argumentName, value) {
        this.getArgumentValue(argumentName).value = value;
    }
    /**
     * @param {?} separateMode
     * @param {?} value
     * @return {?}
     */
    static createSeparateCombineFieldAction(separateMode, value) {
        if (FieldAction.combineActionConfig == null) {
            const /** @type {?} */ argument = new FieldActionArgument();
            argument.name = 'Index';
            argument.type = 'NUMBER';
            FieldAction.combineActionConfig = new FieldActionConfig();
            FieldAction.combineActionConfig.name = 'Combine';
            FieldAction.combineActionConfig.arguments.push(argument);
            FieldAction.separateActionConfig = new FieldActionConfig();
            FieldAction.separateActionConfig.name = 'Separate';
            FieldAction.separateActionConfig.arguments.push(argument);
        }
        const /** @type {?} */ fieldAction = new FieldAction();
        FieldAction.combineActionConfig.populateFieldAction(fieldAction);
        if (separateMode) {
            FieldAction.separateActionConfig.populateFieldAction(fieldAction);
        }
        fieldAction.isSeparateOrCombineMode = true;
        fieldAction.setArgumentValue('Index', (value == null) ? '1' : value);
        return fieldAction;
    }
}
FieldAction.combineActionConfig = null;
FieldAction.separateActionConfig = null;
class FieldActionConfig {
    constructor() {
        this.arguments = [];
        this.sourceType = 'STRING';
        this.targetType = 'STRING';
        this.serviceObject = new Object();
    }
    /**
     * @param {?} field
     * @param {?} fieldPair
     * @return {?}
     */
    appliesToField(field, fieldPair) {
        const /** @type {?} */ type = (field == null) ? null : field.type;
        if (type == null) {
            return false;
        }
        if (this.sourceType == 'STRING' && fieldPair.transition.isMapMode()
            && fieldPair.hasMappedField(true)) {
            const /** @type {?} */ sourceField = fieldPair.getFields(true)[0];
            const /** @type {?} */ sourceFieldIsString = (['STRING', 'CHAR'].indexOf(sourceField.type) != -1);
            if (!sourceFieldIsString) {
                return false;
            }
        }
        if (this.targetType == 'STRING') {
            const /** @type {?} */ fieldTypeIsString = (['STRING', 'CHAR'].indexOf(type) != -1);
            return fieldTypeIsString;
        }
        const /** @type {?} */ typeIsNumber = (['LONG', 'INTEGER', 'FLOAT', 'DOUBLE'].indexOf(type) != -1);
        return typeIsNumber;
    }
    /**
     * @param {?} action
     * @return {?}
     */
    populateFieldAction(action) {
        action.name = this.name;
        action.config = this;
        action.argumentValues = [];
        for (const /** @type {?} */ arg of this.arguments) {
            action.setArgumentValue(arg.name, '0');
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getArgumentForName(name) {
        for (const /** @type {?} */ argument of this.arguments) {
            if (argument.name == name) {
                return argument;
            }
        }
        return null;
    }
}
let TransitionMode = {};
TransitionMode.MAP = 0;
TransitionMode.SEPARATE = 1;
TransitionMode.ENUM = 2;
TransitionMode.COMBINE = 3;
TransitionMode[TransitionMode.MAP] = "MAP";
TransitionMode[TransitionMode.SEPARATE] = "SEPARATE";
TransitionMode[TransitionMode.ENUM] = "ENUM";
TransitionMode[TransitionMode.COMBINE] = "COMBINE";
let TransitionDelimiter = {};
TransitionDelimiter.NONE = 0;
TransitionDelimiter.COLON = 1;
TransitionDelimiter.COMMA = 2;
TransitionDelimiter.MULTISPACE = 3;
TransitionDelimiter.SPACE = 4;
TransitionDelimiter[TransitionDelimiter.NONE] = "NONE";
TransitionDelimiter[TransitionDelimiter.COLON] = "COLON";
TransitionDelimiter[TransitionDelimiter.COMMA] = "COMMA";
TransitionDelimiter[TransitionDelimiter.MULTISPACE] = "MULTISPACE";
TransitionDelimiter[TransitionDelimiter.SPACE] = "SPACE";
class TransitionDelimiterModel {
    /**
     * @param {?} delimiter
     * @param {?} serializedValue
     * @param {?} prettyName
     */
    constructor(delimiter, serializedValue, prettyName) {
        this.delimiter = TransitionDelimiter.SPACE;
        this.serializedValue = null;
        this.prettyName = null;
        this.delimiter = delimiter;
        this.serializedValue = serializedValue;
        this.prettyName = prettyName;
    }
}
class TransitionModel {
    constructor() {
        this.mode = TransitionMode.MAP;
        this.delimiter = TransitionDelimiter.SPACE;
        this.lookupTableName = null;
        if (TransitionModel.delimiterModels.length == 0) {
            const models = [];
            models.push(new TransitionDelimiterModel(TransitionDelimiter.NONE, null, '[None]'));
            models.push(new TransitionDelimiterModel(TransitionDelimiter.COLON, 'Colon', 'Colon'));
            models.push(new TransitionDelimiterModel(TransitionDelimiter.COMMA, 'Comma', 'Comma'));
            models.push(new TransitionDelimiterModel(TransitionDelimiter.MULTISPACE, 'MultiSpace', 'Multispace'));
            models.push(new TransitionDelimiterModel(TransitionDelimiter.SPACE, 'Space', 'Space'));
            TransitionModel.delimiterModels = models;
        }
    }
    /**
     * @param {?} actionName
     * @return {?}
     */
    static getActionConfigForName(actionName) {
        if (actionName == null) {
            return null;
        }
        for (const /** @type {?} */ actionConfig of TransitionModel.actionConfigs) {
            if (actionName == actionConfig.name) {
                return actionConfig;
            }
        }
        return null;
    }
    /**
     * @param {?} delimiter
     * @return {?}
     */
    static getTransitionDelimiterPrettyName(delimiter) {
        for (const /** @type {?} */ m of TransitionModel.delimiterModels) {
            if (m.delimiter == delimiter) {
                return m.prettyName;
            }
        }
        return null;
    }
    /**
     * @return {?}
     */
    getSerializedDelimeter() {
        for (const /** @type {?} */ m of TransitionModel.delimiterModels) {
            if (m.delimiter == this.delimiter) {
                return m.serializedValue;
            }
        }
        return null;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setSerializedDelimeterFromSerializedValue(value) {
        for (const /** @type {?} */ m of TransitionModel.delimiterModels) {
            if (m.serializedValue == value) {
                this.delimiter = m.delimiter;
            }
        }
    }
    /**
     * @return {?}
     */
    getPrettyName() {
        const /** @type {?} */ delimiterDesc = TransitionModel.getTransitionDelimiterPrettyName(this.delimiter);
        if (this.mode == TransitionMode.SEPARATE) {
            return 'Separate (' + delimiterDesc + ')';
        }
        else if (this.mode == TransitionMode.COMBINE) {
            return 'Combine (' + delimiterDesc + ')';
        }
        else if (this.mode == TransitionMode.ENUM) {
            return 'Enum (table: ' + this.lookupTableName + ')';
        }
        return 'Map';
    }
    /**
     * @return {?}
     */
    isSeparateMode() {
        return this.mode == TransitionMode.SEPARATE;
    }
    /**
     * @return {?}
     */
    isMapMode() {
        return this.mode == TransitionMode.MAP;
    }
    /**
     * @return {?}
     */
    isCombineMode() {
        return this.mode == TransitionMode.COMBINE;
    }
    /**
     * @return {?}
     */
    isEnumerationMode() {
        return this.mode == TransitionMode.ENUM;
    }
}
TransitionModel.delimiterModels = [];
TransitionModel.actionConfigs = [];

let ErrorLevel = {};
ErrorLevel.DEBUG = 0;
ErrorLevel.INFO = 1;
ErrorLevel.WARN = 2;
ErrorLevel.ERROR = 3;
ErrorLevel.VALIDATION_ERROR = 4;
ErrorLevel[ErrorLevel.DEBUG] = "DEBUG";
ErrorLevel[ErrorLevel.INFO] = "INFO";
ErrorLevel[ErrorLevel.WARN] = "WARN";
ErrorLevel[ErrorLevel.ERROR] = "ERROR";
ErrorLevel[ErrorLevel.VALIDATION_ERROR] = "VALIDATION_ERROR";
class ErrorInfo {
    /**
     * @param {?} message
     * @param {?} level
     * @param {?=} error
     */
    constructor(message, level, error) {
        this.identifier = ErrorInfo.errorIdentifierCounter.toString();
        this.message = message;
        this.level = level;
        this.error = error;
        ErrorInfo.errorIdentifierCounter++;
    }
}
ErrorInfo.errorIdentifierCounter = 0;

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class MappedFieldParsingData {
    constructor() {
        this.parsedName = null;
        this.parsedPath = null;
        this.parsedValue = null;
        this.parsedDocID = null;
        this.parsedDocURI = null;
        this.parsedIndex = null;
        this.fieldIsProperty = false;
        this.fieldIsConstant = false;
        this.parsedValueType = null;
        this.parsedActions = [];
        this.userCreated = false;
    }
}
class MappedField {
    constructor() {
        this.parsedData = new MappedFieldParsingData();
        this.field = DocumentDefinition.getNoneField();
        this.actions = [];
    }
    /**
     * @param {?} separateMode
     * @param {?} combineMode
     * @param {?} suggestedValue
     * @param {?} isSource
     * @return {?}
     */
    updateSeparateOrCombineIndex(separateMode, combineMode, suggestedValue, isSource) {
        //remove field action when neither combine or separate mode
        let /** @type {?} */ removeField = (!separateMode && !combineMode);
        //remove field when combine and field is target
        removeField = removeField || (combineMode && !isSource);
        //remove field when separate and field is source
        removeField = removeField || (separateMode && isSource);
        if (removeField) {
            this.removeSeparateOrCombineAction();
            return;
        }
        let /** @type {?} */ firstFieldAction = (this.actions.length > 0) ? this.actions[0] : null;
        if (firstFieldAction == null || !firstFieldAction.isSeparateOrCombineMode) {
            //add new separate/combine field action when there isn't one
            firstFieldAction = FieldAction.createSeparateCombineFieldAction(separateMode, suggestedValue);
            this.actions = [firstFieldAction].concat(this.actions);
        }
    }
    /**
     * @return {?}
     */
    removeSeparateOrCombineAction() {
        const /** @type {?} */ firstFieldAction = (this.actions.length > 0) ? this.actions[0] : null;
        if (firstFieldAction != null && firstFieldAction.isSeparateOrCombineMode) {
            DataMapperUtil.removeItemFromArray(firstFieldAction, this.actions);
        }
    }
    /**
     * @return {?}
     */
    getSeparateOrCombineIndex() {
        const /** @type {?} */ firstFieldAction = (this.actions.length > 0) ? this.actions[0] : null;
        if (firstFieldAction != null && firstFieldAction.isSeparateOrCombineMode) {
            return firstFieldAction.argumentValues[0].value;
        }
        return null;
    }
    /**
     * @param {?} action
     * @return {?}
     */
    removeAction(action) {
        DataMapperUtil.removeItemFromArray(action, this.actions);
    }
    /**
     * @param {?} mappedFields
     * @param {?} allowNone
     * @return {?}
     */
    static sortMappedFieldsByPath(mappedFields, allowNone) {
        if (mappedFields == null || mappedFields.length == 0) {
            return [];
        }
        const /** @type {?} */ fieldsByPath = {};
        const /** @type {?} */ fieldPaths = [];
        for (const /** @type {?} */ mappedField of mappedFields) {
            if (mappedField == null || mappedField.field == null) {
                continue;
            }
            if (!allowNone && mappedField.field == DocumentDefinition.getNoneField()) {
                continue;
            }
            const /** @type {?} */ path = mappedField.field.path;
            fieldsByPath[path] = mappedField;
            fieldPaths.push(path);
        }
        fieldPaths.sort();
        const /** @type {?} */ result = [];
        for (const /** @type {?} */ name of fieldPaths) {
            result.push(fieldsByPath[name]);
        }
        return result;
    }
    /**
     * @return {?}
     */
    isMapped() {
        return (this.field != null) && (this.field != DocumentDefinition.getNoneField());
    }
}
class FieldMappingPair {
    constructor() {
        this.sourceFields = [new MappedField()];
        this.targetFields = [new MappedField()];
        this.transition = new TransitionModel();
        return;
    }
    /**
     * @param {?} field
     * @param {?} isSource
     * @return {?}
     */
    addField(field, isSource) {
        const /** @type {?} */ mappedField = new MappedField();
        mappedField.field = field;
        this.getMappedFields(isSource).push(mappedField);
    }
    /**
     * @param {?} isSource
     * @return {?}
     */
    hasMappedField(isSource) {
        const /** @type {?} */ mappedFields = isSource ? this.sourceFields : this.targetFields;
        for (const /** @type {?} */ mappedField of mappedFields) {
            if (mappedField.isMapped()) {
                return true;
            }
        }
        return false;
    }
    /**
     * @return {?}
     */
    isFullyMapped() {
        return this.hasMappedField(true) && this.hasMappedField(false);
    }
    /**
     * @param {?} mappedField
     * @param {?} isSource
     * @return {?}
     */
    addMappedField(mappedField, isSource) {
        this.getMappedFields(isSource).push(mappedField);
    }
    /**
     * @param {?} mappedField
     * @param {?} isSource
     * @return {?}
     */
    removeMappedField(mappedField, isSource) {
        DataMapperUtil.removeItemFromArray(mappedField, this.getMappedFields(isSource));
    }
    /**
     * @param {?} field
     * @param {?} isSource
     * @return {?}
     */
    getMappedFieldForField(field, isSource) {
        for (const /** @type {?} */ mappedField of this.getMappedFields(isSource)) {
            if (mappedField.field == field) {
                return mappedField;
            }
        }
        return null;
    }
    /**
     * @param {?} isSource
     * @return {?}
     */
    getMappedFields(isSource) {
        return isSource ? this.sourceFields : this.targetFields;
    }
    /**
     * @param {?} isSource
     * @return {?}
     */
    getLastMappedField(isSource) {
        const /** @type {?} */ fields = this.getMappedFields(isSource);
        if ((fields != null) && (fields.length > 0)) {
            return fields[fields.length - 1];
        }
        return null;
    }
    /**
     * @param {?} isSource
     * @return {?}
     */
    getFields(isSource) {
        const /** @type {?} */ fields = [];
        for (const /** @type {?} */ mappedField of this.getMappedFields(isSource)) {
            if (mappedField.field != null) {
                fields.push(mappedField.field);
            }
        }
        return fields;
    }
    /**
     * @param {?} isSource
     * @return {?}
     */
    getFieldNames(isSource) {
        const /** @type {?} */ fields = this.getFields(isSource);
        Field.alphabetizeFields(fields);
        const /** @type {?} */ names = [];
        for (const /** @type {?} */ field of fields) {
            if (field == DocumentDefinition.getNoneField()) {
                continue;
            }
            names.push(field.name);
        }
        return names;
    }
    /**
     * @param {?} isSource
     * @return {?}
     */
    getFieldPaths(isSource) {
        const /** @type {?} */ fields = this.getFields(isSource);
        Field.alphabetizeFields(fields);
        const /** @type {?} */ paths = [];
        for (const /** @type {?} */ field of fields) {
            if (field == DocumentDefinition.getNoneField()) {
                continue;
            }
            paths.push(field.path);
        }
        return paths;
    }
    /**
     * @return {?}
     */
    hasFieldActions() {
        for (const /** @type {?} */ mappedField of this.getAllMappedFields()) {
            if (mappedField.actions.length > 0) {
                return true;
            }
        }
        return false;
    }
    /**
     * @return {?}
     */
    getAllFields() {
        return this.getFields(true).concat(this.getFields(false));
    }
    /**
     * @return {?}
     */
    getAllMappedFields() {
        return this.getMappedFields(true).concat(this.getMappedFields(false));
    }
    /**
     * @param {?} field
     * @return {?}
     */
    isFieldMapped(field) {
        return this.getMappedFieldForField(field, field.isSource()) != null;
    }
    /**
     * @return {?}
     */
    hasTransition() {
        const /** @type {?} */ mappedFields = this.getAllMappedFields();
        for (const /** @type {?} */ mappedField of mappedFields) {
            if (mappedField.actions.length > 0) {
                return true;
            }
        }
        return false;
    }
    /**
     * @return {?}
     */
    updateTransition() {
        for (const /** @type {?} */ field of this.getAllFields()) {
            if (field.enumeration) {
                this.transition.mode = TransitionMode.ENUM;
                break;
            }
        }
        let /** @type {?} */ mappedFields = this.getMappedFields(false);
        for (const /** @type {?} */ mappedField of mappedFields) {
            const /** @type {?} */ actionsToRemove = [];
            for (const /** @type {?} */ action of mappedField.actions) {
                const /** @type {?} */ actionConfig = TransitionModel.getActionConfigForName(action.name);
                if (actionConfig != null && !actionConfig.appliesToField(mappedField.field, this)) {
                    actionsToRemove.push(action);
                }
            }
            for (const /** @type {?} */ action of actionsToRemove) {
                mappedField.removeAction(action);
            }
        }
        const /** @type {?} */ separateMode = (this.transition.mode == TransitionMode.SEPARATE);
        const /** @type {?} */ combineMode = (this.transition.mode == TransitionMode.COMBINE);
        if (separateMode || combineMode) {
            const /** @type {?} */ isSource = combineMode;
            mappedFields = this.getMappedFields(isSource);
            //remove indexes from targets in combine mode, from sources in seperate mode
            for (const /** @type {?} */ mappedField of this.getMappedFields(!isSource)) {
                mappedField.removeSeparateOrCombineAction();
            }
            //find max seperator index from existing fields
            let /** @type {?} */ maxIndex = 0;
            for (const /** @type {?} */ mappedField of mappedFields) {
                const /** @type {?} */ index = mappedField.getSeparateOrCombineIndex();
                const /** @type {?} */ indexAsNumber = (index == null) ? 0 : parseInt(index, 10);
                maxIndex = Math.max(maxIndex, indexAsNumber);
            }
            maxIndex += 1; //we want our next index to be one larger than previously found indexes
            for (const /** @type {?} */ mappedField of mappedFields) {
                mappedField.updateSeparateOrCombineIndex(separateMode, combineMode, maxIndex.toString(), isSource);
                //see if this field used the new index, if so, increment
                const /** @type {?} */ index = mappedField.getSeparateOrCombineIndex();
                if (index == maxIndex.toString()) {
                    maxIndex += 1;
                }
            }
        }
        else {
            for (const /** @type {?} */ mappedField of this.getAllMappedFields()) {
                mappedField.removeSeparateOrCombineAction();
            }
        }
    }
}
class MappingModel {
    constructor() {
        this.fieldMappings = [];
        this.currentFieldMapping = null;
        this.validationErrors = [];
        this.brandNewMapping = true;
        this.uuid = 'mapping.' + Math.floor((Math.random() * 1000000) + 1).toString();
        this.fieldMappings.push(new FieldMappingPair());
    }
    /**
     * @return {?}
     */
    getFirstFieldMapping() {
        if (this.fieldMappings == null || (this.fieldMappings.length == 0)) {
            return null;
        }
        return this.fieldMappings[0];
    }
    /**
     * @return {?}
     */
    getLastFieldMapping() {
        if (this.fieldMappings == null || (this.fieldMappings.length == 0)) {
            return null;
        }
        return this.fieldMappings[this.fieldMappings.length - 1];
    }
    /**
     * @return {?}
     */
    getCurrentFieldMapping() {
        return (this.currentFieldMapping == null) ? this.getLastFieldMapping() : this.currentFieldMapping;
    }
    /**
     * @param {?} message
     * @return {?}
     */
    addValidationError(message) {
        const /** @type {?} */ e = new ErrorInfo(message, ErrorLevel.VALIDATION_ERROR);
        this.validationErrors.push(e);
    }
    /**
     * @return {?}
     */
    clearValidationErrors() {
        this.validationErrors = [];
    }
    /**
     * @return {?}
     */
    getValidationErrors() {
        return this.validationErrors.filter(e => e.level >= ErrorLevel.ERROR);
    }
    /**
     * @return {?}
     */
    getValidationWarnings() {
        return this.validationErrors.filter(e => e.level == ErrorLevel.WARN);
    }
    /**
     * @param {?} identifier
     * @return {?}
     */
    removeError(identifier) {
        for (let /** @type {?} */ i = 0; i < this.validationErrors.length; i++) {
            if (this.validationErrors[i].identifier == identifier) {
                this.validationErrors.splice(i, 1);
                return;
            }
        }
    }
    /**
     * @param {?} isSource
     * @return {?}
     */
    getFirstCollectionField(isSource) {
        for (const /** @type {?} */ f of this.getFields(isSource)) {
            if (f.isInCollection()) {
                return f;
            }
        }
        return null;
    }
    /**
     * @return {?}
     */
    isCollectionMode() {
        return (this.getFirstCollectionField(true) != null)
            || (this.getFirstCollectionField(false) != null);
    }
    /**
     * @return {?}
     */
    isLookupMode() {
        for (const /** @type {?} */ f of this.getAllFields()) {
            if (f.enumeration) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} fieldPair
     * @return {?}
     */
    removeMappedPair(fieldPair) {
        DataMapperUtil.removeItemFromArray(fieldPair, this.fieldMappings);
    }
    /**
     * @param {?} isSource
     * @return {?}
     */
    getMappedFields(isSource) {
        let /** @type {?} */ fields = [];
        for (const /** @type {?} */ fieldPair of this.fieldMappings) {
            fields = fields.concat(fieldPair.getMappedFields(isSource));
        }
        return fields;
    }
    /**
     * @param {?} field
     * @return {?}
     */
    isFieldSelectable(field) {
        return this.getFieldSelectionExclusionReason(field) == null;
    }
    /**
     * @param {?} field
     * @return {?}
     */
    getFieldSelectionExclusionReason(field) {
        if (this.brandNewMapping) {
            return null;
        }
        if (!field.isTerminal()) {
            return 'field is a parent field';
        }
        const /** @type {?} */ repeatedMode = this.isCollectionMode();
        const /** @type {?} */ lookupMode = this.isLookupMode();
        let /** @type {?} */ mapMode = false;
        let /** @type {?} */ separateMode = false;
        let /** @type {?} */ combineMode = false;
        if (!repeatedMode && !lookupMode) {
            for (const /** @type {?} */ fieldPair of this.fieldMappings) {
                mapMode = mapMode || fieldPair.transition.isMapMode();
                separateMode = separateMode || fieldPair.transition.isSeparateMode();
                combineMode = combineMode || fieldPair.transition.isCombineMode();
            }
        }
        if (mapMode || separateMode || combineMode) {
            //repeated fields and enums are not selectable in these modes
            if (field.isInCollection()) {
                return 'Repeated fields are not valid for this mapping';
            }
            if (field.enumeration) {
                return 'Enumeration fields are not valid for this mapping';
            }
            //separate mode sources must be string
            if (separateMode && !field.isStringField() && field.isSource()) {
                return 'source fields for this mapping must be type String';
            }
        }
        else if (lookupMode) {
            if (!field.enumeration) {
                return 'only Enumeration fields are valid for this mapping';
            }
        }
        else if (repeatedMode) {
            //enumeration fields are not allowed in repeated mappings
            if (field.enumeration) {
                return 'Enumeration fields are not valid for this mapping';
            }
            //if no fields for this isSource has been selected yet, everything is open to selection
            if (!this.hasMappedFields(field.isSource())) {
                return null;
            }
            const /** @type {?} */ collectionField = this.getFirstCollectionField(field.isSource());
            if (collectionField == null) {
                //only primitive fields (not in collections) are selectable
                if (field.isInCollection()) {
                    const /** @type {?} */ fieldTypeDesc = field.isSource ? 'source' : 'target';
                    return fieldTypeDesc + ' fields cannot be repeated fields for this mapping.';
                }
            }
            else {
                const /** @type {?} */ parentCollectionField = collectionField.getCollectionParentField();
                //primitive fields are not selectable when collection field is already selected
                if (!field.isInCollection()) {
                    return 'field is not selectable, it is not a child of ' + parentCollectionField.displayName;
                }
                //children of collections are only selectable if this field is in the same collection
                if (field.getCollectionParentField() != parentCollectionField) {
                    return 'field is not selectable, it is not a child of ' + parentCollectionField.displayName;
                }
            }
        }
        return null;
    }
    /**
     * @param {?} field
     * @param {?} isSource
     * @return {?}
     */
    isFieldMapped(field, isSource) {
        return this.getFields(isSource).indexOf(field) != -1;
    }
    /**
     * @return {?}
     */
    getAllMappedFields() {
        return this.getMappedFields(true).concat(this.getMappedFields(false));
    }
    /**
     * @return {?}
     */
    getAllFields() {
        return this.getFields(true).concat(this.getFields(false));
    }
    /**
     * @param {?} isSource
     * @return {?}
     */
    getFields(isSource) {
        let /** @type {?} */ fields = [];
        for (const /** @type {?} */ fieldPair of this.fieldMappings) {
            fields = fields.concat(fieldPair.getFields(isSource));
        }
        return fields;
    }
    /**
     * @param {?} isSource
     * @return {?}
     */
    hasMappedFields(isSource) {
        for (const /** @type {?} */ mappedField of this.getMappedFields(isSource)) {
            if (mappedField.isMapped()) {
                return true;
            }
        }
        return false;
    }
    /**
     * @return {?}
     */
    hasFullyMappedPair() {
        for (const /** @type {?} */ pair of this.fieldMappings) {
            if (pair.isFullyMapped()) {
                return true;
            }
        }
        return false;
    }
}

class LookupTableEntry {
    constructor() {
        this.sourceType = 'STRING';
        this.targetType = 'STRING';
    }
    /**
     * @return {?}
     */
    toJSON() {
        return {
            'sourceValue': this.sourceValue,
            'sourceType': this.sourceType,
            'targetValue': this.targetValue,
            'targetType': this.targetType,
        };
    }
    /**
     * @param {?} json
     * @return {?}
     */
    fromJSON(json) {
        this.sourceValue = json.sourceValue;
        this.sourceType = json.sourceType;
        this.targetValue = json.targetValue;
        this.targetType = json.targetType;
    }
}
class LookupTable {
    constructor() {
        this.entries = [];
        this.name = (new Date().getTime() + '-' + Math.floor(Math.random() * 1000000).toString());
    }
    /**
     * @return {?}
     */
    getInputOutputKey() {
        return this.sourceIdentifier + ':' + this.targetIdentifier;
    }
    /**
     * @param {?} sourceValue
     * @param {?} autocreate
     * @return {?}
     */
    getEntryForSource(sourceValue, autocreate) {
        for (const /** @type {?} */ entry of this.entries) {
            if (entry.sourceValue == sourceValue) {
                return entry;
            }
        }
        if (autocreate) {
            const /** @type {?} */ entry = new LookupTableEntry();
            entry.sourceValue = sourceValue;
            this.entries.push(entry);
            return entry;
        }
        return null;
    }
    /**
     * @return {?}
     */
    toString() {
        let /** @type {?} */ result = 'Lookup Table, name: ' + this.name + ', entries: ' + this.entries.length;
        result += '\n\sourceIdentifier: ' + this.sourceIdentifier;
        result += '\n\targetIdentifier: ' + this.targetIdentifier;
        let /** @type {?} */ counter = 0;
        for (const /** @type {?} */ entry of this.entries) {
            result += '\n\tEntry #' + counter + ': ' + entry.sourceValue + ' => ' + entry.targetValue;
            counter += 1;
        }
        return result;
    }
}

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class MappingSerializer {
    /**
     * @param {?} cfg
     * @return {?}
     */
    static serializeMappings(cfg) {
        const /** @type {?} */ mappingDefinition = cfg.mappings;
        let /** @type {?} */ jsonMappings = [];
        for (const /** @type {?} */ mapping of mappingDefinition.mappings) {
            try {
                let /** @type {?} */ fieldMappingsForThisMapping = [];
                let /** @type {?} */ jsonMapping;
                for (const /** @type {?} */ fieldMappingPair of mapping.fieldMappings) {
                    const /** @type {?} */ serializedInputFields = MappingSerializer.serializeFields(fieldMappingPair, true, cfg);
                    const /** @type {?} */ serializedOutputFields = MappingSerializer.serializeFields(fieldMappingPair, false, cfg);
                    jsonMapping = {
                        'jsonType': 'io.atlasmap.v2.Mapping',
                        'mappingType': 'MAP',
                        'id': mapping.uuid,
                        'inputField': serializedInputFields,
                        'outputField': serializedOutputFields,
                    };
                    if (fieldMappingPair.transition.isSeparateMode()) {
                        jsonMapping['mappingType'] = 'SEPARATE';
                        jsonMapping['strategy'] = fieldMappingPair.transition.getSerializedDelimeter();
                    }
                    else if (fieldMappingPair.transition.isCombineMode()) {
                        jsonMapping['mappingType'] = 'COMBINE';
                        jsonMapping['strategy'] = fieldMappingPair.transition.getSerializedDelimeter();
                    }
                    else if (fieldMappingPair.transition.isEnumerationMode()) {
                        jsonMapping['mappingType'] = 'LOOKUP';
                        jsonMapping['lookupTableName'] = fieldMappingPair.transition.lookupTableName;
                    }
                    fieldMappingsForThisMapping.push(jsonMapping);
                }
                if (mapping.isCollectionMode()) {
                    let /** @type {?} */ collectionType = null;
                    for (const /** @type {?} */ field of mapping.getAllFields()) {
                        collectionType = field.getCollectionType();
                        if (collectionType != null) {
                            break;
                        }
                    }
                    jsonMapping = {
                        'jsonType': ConfigModel.mappingServicesPackagePrefix + '.Collection',
                        'mappingType': 'COLLECTION',
                        'collectionType': collectionType,
                        'mappings': { 'mapping': fieldMappingsForThisMapping },
                    };
                    fieldMappingsForThisMapping = [jsonMapping];
                }
                jsonMappings = jsonMappings.concat(fieldMappingsForThisMapping);
            }
            catch (e) {
                const /** @type {?} */ input = { 'mapping': mapping, 'mapping def': mappingDefinition };
                cfg.errorService.error('Caught exception while attempting to serialize mapping, skipping. ', { 'input': input, 'error': e });
            }
        }
        const /** @type {?} */ serializedLookupTables = MappingSerializer.serializeLookupTables(cfg.mappings);
        const /** @type {?} */ propertyDescriptions = MappingSerializer.serializeProperties(cfg.propertyDoc);
        const /** @type {?} */ serializedDataSources = MappingSerializer.serializeDocuments(cfg.sourceDocs.concat(cfg.targetDocs), mappingDefinition);
        const /** @type {?} */ payload = {
            'AtlasMapping': {
                'jsonType': ConfigModel.mappingServicesPackagePrefix + '.AtlasMapping',
                'dataSource': serializedDataSources,
                'mappings': { 'mapping': jsonMappings },
                'name': cfg.mappings.name,
                'lookupTables': { 'lookupTable': serializedLookupTables },
                'properties': { 'property': propertyDescriptions },
            },
        };
        return payload;
    }
    /**
     * @param {?} docs
     * @param {?} mappingDefinition
     * @return {?}
     */
    static serializeDocuments(docs, mappingDefinition) {
        const /** @type {?} */ serializedDocs = [];
        for (const /** @type {?} */ doc of docs) {
            const /** @type {?} */ docType = doc.isSource ? 'SOURCE' : 'TARGET';
            const /** @type {?} */ serializedDoc = {
                'jsonType': 'io.atlasmap.v2.DataSource',
                'id': doc.initCfg.shortIdentifier,
                'uri': doc.uri,
                'dataSourceType': docType,
            };
            if (doc.characterEncoding != null) {
                serializedDoc['characterEncoding'] = doc.characterEncoding;
            }
            if (doc.locale != null) {
                serializedDoc['locale'] = doc.locale;
            }
            if (doc.initCfg.type.isXML()) {
                serializedDoc['jsonType'] = 'io.atlasmap.xml.v2.XmlDataSource';
                const /** @type {?} */ namespaces = [];
                for (const /** @type {?} */ ns of doc.namespaces) {
                    namespaces.push({
                        'alias': ns.alias,
                        'uri': ns.uri,
                        'locationUri': ns.locationUri,
                        'targetNamespace': ns.isTarget,
                    });
                }
                if (!doc.isSource) {
                    serializedDoc['template'] = mappingDefinition.templateText;
                }
                serializedDoc['xmlNamespaces'] = { 'xmlNamespace': namespaces };
            }
            else if (doc.initCfg.type.isJSON()) {
                if (!doc.isSource) {
                    serializedDoc['template'] = mappingDefinition.templateText;
                }
                serializedDoc['jsonType'] = 'io.atlasmap.json.v2.JsonDataSource';
            }
            serializedDocs.push(serializedDoc);
        }
        return serializedDocs;
    }
    /**
     * @param {?} docDef
     * @return {?}
     */
    static serializeProperties(docDef) {
        const /** @type {?} */ propertyDescriptions = [];
        for (const /** @type {?} */ field of docDef.fields) {
            propertyDescriptions.push({ 'name': field.name,
                'value': field.value, 'fieldType': field.type });
        }
        return propertyDescriptions;
    }
    /**
     * @param {?} mappingDefinition
     * @return {?}
     */
    static serializeLookupTables(mappingDefinition) {
        const /** @type {?} */ tables = mappingDefinition.getTables();
        if (!tables || !tables.length) {
            return [];
        }
        const /** @type {?} */ serializedTables = [];
        for (const /** @type {?} */ table of tables) {
            const /** @type {?} */ lookupEntries = [];
            for (const /** @type {?} */ entry of table.entries) {
                const /** @type {?} */ serializedEntry = {
                    'sourceValue': entry.sourceValue,
                    'sourceType': entry.sourceType,
                    'targetValue': entry.targetValue,
                    'targetType': entry.targetType,
                };
                lookupEntries.push(serializedEntry);
            }
            const /** @type {?} */ serializedTable = {
                'lookupEntry': lookupEntries,
                'name': table.name,
            };
            serializedTables.push(serializedTable);
        }
        return serializedTables;
    }
    /**
     * @param {?} fieldPair
     * @param {?} isSource
     * @param {?} cfg
     * @return {?}
     */
    static serializeFields(fieldPair, isSource, cfg) {
        const /** @type {?} */ fields = fieldPair.getMappedFields(isSource);
        const /** @type {?} */ fieldsJson = [];
        for (const /** @type {?} */ mappedField of fields) {
            const /** @type {?} */ field = mappedField.field;
            if (DocumentDefinition.getNoneField().path == field.path) {
                //do not include "none" options from drop downs in mapping
                continue;
            }
            const /** @type {?} */ serializedField = {
                'jsonType': field.serviceObject.jsonType,
                'name': field.name,
                'path': field.path,
                'fieldType': field.type,
                'value': field.value,
                'docId': field.docDef.initCfg.shortIdentifier,
            };
            if (field.docDef.initCfg.type.isXML() || field.docDef.initCfg.type.isJSON()) {
                serializedField['userCreated'] = field.userCreated;
            }
            if (field.isProperty()) {
                serializedField['jsonType'] = ConfigModel.mappingServicesPackagePrefix + '.PropertyField';
                serializedField['name'] = field.path;
            }
            else if (field.isConstant()) {
                serializedField['jsonType'] = ConfigModel.mappingServicesPackagePrefix + '.ConstantField';
                delete (serializedField['name']);
            }
            else if (field.enumeration) {
                serializedField['jsonType'] = 'io.atlasmap.java.v2.JavaEnumField';
            }
            else {
                delete (serializedField['value']);
            }
            let /** @type {?} */ includeIndexes = fieldPair.transition.isSeparateMode() && !isSource;
            includeIndexes = includeIndexes || (fieldPair.transition.isCombineMode() && isSource);
            if (includeIndexes) {
                let /** @type {?} */ index = mappedField.getSeparateOrCombineIndex();
                index = (index == null) ? '1' : index;
                serializedField['index'] = (parseInt(index, 10) - 1);
            }
            if (mappedField.actions.length) {
                const /** @type {?} */ actions = [];
                for (const /** @type {?} */ action of mappedField.actions) {
                    if (action.isSeparateOrCombineMode) {
                        continue;
                    }
                    let /** @type {?} */ actionArguments = {};
                    for (const /** @type {?} */ argValue of action.argumentValues) {
                        actionArguments[argValue.name] = argValue.value;
                        const /** @type {?} */ argumentConfig = action.config.getArgumentForName(argValue.name);
                        if (argumentConfig == null) {
                            cfg.errorService.error('Cannot find action argument with name: ' + argValue.name, action);
                            continue;
                        }
                        if (argumentConfig.type == 'INTEGER') {
                            actionArguments[argValue.name] = parseInt(argValue.value, 10);
                        }
                    }
                    actionArguments = (Object.keys(actionArguments).length == 0) ? null : actionArguments;
                    const /** @type {?} */ actionJson = {};
                    actionJson[action.config.name] = actionArguments;
                    actions.push(actionJson);
                }
                if (actions.length > 0) {
                    serializedField['actions'] = actions;
                }
            }
            fieldsJson.push(serializedField);
        }
        return fieldsJson;
    }
    /**
     * @param {?} json
     * @param {?} mappingDefinition
     * @param {?} cfg
     * @return {?}
     */
    static deserializeMappingServiceJSON(json, mappingDefinition, cfg) {
        if (json && json.AtlasMapping && json.AtlasMapping.name) {
            mappingDefinition.name = json.AtlasMapping.name;
        }
        mappingDefinition.parsedDocs = mappingDefinition.parsedDocs.concat(MappingSerializer.deserializeDocs(json, mappingDefinition));
        mappingDefinition.mappings = mappingDefinition.mappings.concat(MappingSerializer.deserializeMappings(json, cfg));
        for (const /** @type {?} */ lookupTable of MappingSerializer.deserializeLookupTables(json)) {
            mappingDefinition.addTable(lookupTable);
        }
        for (const /** @type {?} */ field of MappingSerializer.deserializeProperties(json)) {
            cfg.propertyDoc.addField(field);
        }
    }
    /**
     * @param {?} json
     * @param {?} mappingDefinition
     * @return {?}
     */
    static deserializeDocs(json, mappingDefinition) {
        const /** @type {?} */ docs = [];
        for (const /** @type {?} */ docRef of json.AtlasMapping.dataSource) {
            const /** @type {?} */ doc = new DocumentDefinition();
            doc.isSource = (docRef.dataSourceType == 'SOURCE');
            doc.initCfg.documentIdentifier = docRef.uri;
            doc.initCfg.shortIdentifier = docRef.id;
            if (docRef.xmlNamespaces && docRef.xmlNamespaces.xmlNamespace) {
                for (const /** @type {?} */ svcNS of docRef.xmlNamespaces.xmlNamespace) {
                    const /** @type {?} */ ns = new NamespaceModel();
                    ns.alias = svcNS.alias;
                    ns.uri = svcNS.uri;
                    ns.locationUri = svcNS.locationUri;
                    ns.isTarget = svcNS.targetNamespace;
                    ns.createdByUser = true;
                    doc.namespaces.push(ns);
                }
            }
            if (docRef.template) {
                mappingDefinition.templateText = docRef.template;
            }
            docs.push(doc);
        }
        return docs;
    }
    /**
     * @param {?} json
     * @param {?} cfg
     * @return {?}
     */
    static deserializeMappings(json, cfg) {
        const /** @type {?} */ mappings = [];
        const /** @type {?} */ docRefs = {};
        for (const /** @type {?} */ docRef of json.AtlasMapping.dataSource) {
            docRefs[docRef.id] = docRef.uri;
        }
        for (const /** @type {?} */ fieldMapping of json.AtlasMapping.mappings.mapping) {
            const /** @type {?} */ mappingModel = new MappingModel();
            if (fieldMapping.id) {
                mappingModel.uuid = fieldMapping.id;
            }
            mappingModel.fieldMappings = [];
            const /** @type {?} */ isCollectionMapping = (fieldMapping.jsonType == ConfigModel.mappingServicesPackagePrefix + '.Collection');
            if (isCollectionMapping) {
                for (const /** @type {?} */ innerFieldMapping of fieldMapping.mappings.mapping) {
                    mappingModel.fieldMappings.push(MappingSerializer.deserializeFieldMapping(innerFieldMapping, docRefs, cfg));
                }
            }
            else {
                mappingModel.fieldMappings.push(MappingSerializer.deserializeFieldMapping(fieldMapping, docRefs, cfg));
            }
            mappings.push(mappingModel);
        }
        return mappings;
    }
    /**
     * @param {?} fieldMapping
     * @param {?} docRefs
     * @param {?} cfg
     * @return {?}
     */
    static deserializeFieldMapping(fieldMapping, docRefs, cfg) {
        const /** @type {?} */ fieldPair = new FieldMappingPair();
        fieldPair.sourceFields = [];
        fieldPair.targetFields = [];
        const /** @type {?} */ isSeparateMapping = (fieldMapping.mappingType == 'SEPARATE');
        const /** @type {?} */ isLookupMapping = (fieldMapping.mappingType == 'LOOKUP');
        const /** @type {?} */ isCombineMapping = (fieldMapping.mappingType == 'COMBINE');
        for (const /** @type {?} */ field of fieldMapping.inputField) {
            MappingSerializer.addFieldIfDoesntExist(fieldPair, field, true, docRefs, cfg);
        }
        for (const /** @type {?} */ field of fieldMapping.outputField) {
            MappingSerializer.addFieldIfDoesntExist(fieldPair, field, false, docRefs, cfg);
        }
        if (isSeparateMapping) {
            fieldPair.transition.mode = TransitionMode.SEPARATE;
            fieldPair.transition.setSerializedDelimeterFromSerializedValue(fieldMapping.strategy);
        }
        else if (isCombineMapping) {
            fieldPair.transition.mode = TransitionMode.COMBINE;
            fieldPair.transition.setSerializedDelimeterFromSerializedValue(fieldMapping.strategy);
        }
        else if (isLookupMapping) {
            fieldPair.transition.lookupTableName = fieldMapping.lookupTableName;
            fieldPair.transition.mode = TransitionMode.ENUM;
        }
        else {
            fieldPair.transition.mode = TransitionMode.MAP;
        }
        return fieldPair;
    }
    /**
     * @param {?} jsonMapping
     * @return {?}
     */
    static deserializeProperties(jsonMapping) {
        const /** @type {?} */ fields = [];
        if (!jsonMapping.AtlasMapping || !jsonMapping.AtlasMapping.properties
            || !jsonMapping.AtlasMapping.properties.property) {
            return fields;
        }
        for (const /** @type {?} */ property of jsonMapping.AtlasMapping.properties.property) {
            const /** @type {?} */ field = new Field();
            field.name = property.name;
            field.value = property.value;
            field.type = property.fieldType;
            field.userCreated = true;
            fields.push(field);
        }
        return fields;
    }
    /**
     * @param {?} jsonMapping
     * @return {?}
     */
    static deserializeLookupTables(jsonMapping) {
        const /** @type {?} */ tables = [];
        if (!jsonMapping.AtlasMapping || !jsonMapping.AtlasMapping.lookupTables
            || !jsonMapping.AtlasMapping.lookupTables.lookupTable) {
            return tables;
        }
        for (const /** @type {?} */ table of jsonMapping.AtlasMapping.lookupTables.lookupTable) {
            const /** @type {?} */ parsedTable = new LookupTable();
            parsedTable.name = table.name;
            for (const /** @type {?} */ entry of table.lookupEntry) {
                const /** @type {?} */ parsedEntry = new LookupTableEntry();
                parsedEntry.sourceValue = entry.sourceValue;
                parsedEntry.sourceType = entry.sourceType;
                parsedEntry.targetValue = entry.targetValue;
                parsedEntry.targetType = entry.targetType;
                parsedTable.entries.push(parsedEntry);
            }
            tables.push(parsedTable);
        }
        return tables;
    }
    /**
     * @param {?} fieldPair
     * @param {?} field
     * @param {?} isSource
     * @param {?} docRefs
     * @param {?} cfg
     * @return {?}
     */
    static addFieldIfDoesntExist(fieldPair, field, isSource, docRefs, cfg) {
        const /** @type {?} */ mappedField = new MappedField();
        mappedField.parsedData.parsedValueType = field.fieldType;
        mappedField.parsedData.parsedIndex = '1';
        if (field.index != null) {
            mappedField.parsedData.parsedIndex = (field.index + 1).toString();
        }
        if (field.jsonType == (ConfigModel.mappingServicesPackagePrefix + '.PropertyField')) {
            mappedField.parsedData.parsedName = field.name;
            mappedField.parsedData.parsedPath = field.name;
            mappedField.parsedData.fieldIsProperty = true;
        }
        else if (field.jsonType == (ConfigModel.mappingServicesPackagePrefix + '.ConstantField')) {
            mappedField.parsedData.fieldIsConstant = true;
            mappedField.parsedData.parsedValue = field.value;
            mappedField.parsedData.parsedPath = field.path;
        }
        else {
            if (field.docId == null) {
                cfg.errorService.error('Parsed mapping field does not have document id, dropping.', field);
                return null;
            }
            mappedField.parsedData.parsedName = field.name;
            mappedField.parsedData.parsedPath = field.path;
            mappedField.parsedData.parsedDocID = field.docId;
            mappedField.parsedData.parsedDocURI = docRefs[field.docId];
            if (field.userCreated) {
                mappedField.parsedData.userCreated = true;
            }
            if (mappedField.parsedData.parsedDocURI == null) {
                cfg.errorService.error('Could not find document URI for parsed mapped field.', { 'fieldJSON': field, 'knownDocs': docRefs });
                return null;
            }
            if (field.actions) {
                for (const /** @type {?} */ action of field.actions) {
                    for (const /** @type {?} */ actionName in action) {
                        if (!action.hasOwnProperty(actionName)) {
                            continue;
                        }
                        const /** @type {?} */ parsedAction = new FieldAction();
                        parsedAction.name = actionName;
                        const /** @type {?} */ actionParams = action[actionName];
                        if (actionParams) {
                            for (const /** @type {?} */ paramName in actionParams) {
                                if (!actionParams.hasOwnProperty(paramName)) {
                                    continue;
                                }
                                const /** @type {?} */ parsedArgumentValue = new FieldActionArgumentValue();
                                parsedArgumentValue.name = paramName;
                                let /** @type {?} */ value = actionParams[paramName];
                                value = value == null ? null : value.toString();
                                parsedArgumentValue.value = value;
                                parsedAction.argumentValues.push(parsedArgumentValue);
                            }
                        }
                        mappedField.parsedData.parsedActions.push(parsedAction);
                    }
                }
            }
        }
        fieldPair.addMappedField(mappedField, isSource);
        return mappedField;
    }
}

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class MappingManagementService {
    /**
     * @param {?} http
     */
    constructor(http$$1) {
        this.http = http$$1;
        this.mappingUpdatedSource = new Subject$1();
        this.mappingUpdated$ = this.mappingUpdatedSource.asObservable();
        this.saveMappingSource = new Subject$1();
        this.saveMappingOutput$ = this.saveMappingSource.asObservable();
        this.mappingSelectionRequiredSource = new Subject$1();
        this.mappingSelectionRequired$ = this.mappingSelectionRequiredSource.asObservable();
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }
    /**
     * @return {?}
     */
    initialize() {
        return;
    }
    /**
     * @param {?} filter
     * @return {?}
     */
    findMappingFiles(filter$$1) {
        return new Observable$1((observer) => {
            const /** @type {?} */ url = this.cfg.initCfg.baseMappingServiceUrl + 'mappings' + (filter$$1 == null ? '' : '?filter=' + filter$$1);
            DataMapperUtil.debugLogJSON(null, 'Mapping List Response', this.cfg.initCfg.debugMappingServiceCalls, url);
            this.http.get(url, { headers: this.headers }).toPromise()
                .then((res) => {
                const /** @type {?} */ body = res.json();
                DataMapperUtil.debugLogJSON(body, 'Mapping List Response', this.cfg.initCfg.debugMappingServiceCalls, url);
                const /** @type {?} */ entries = body.StringMap.stringMapEntry;
                const /** @type {?} */ mappingFileNames = [];
                for (const /** @type {?} */ entry of entries) {
                    mappingFileNames.push(entry.name);
                }
                observer.next(mappingFileNames);
                observer.complete();
            })
                .catch((error) => {
                observer.error(error);
                observer.complete();
            });
        });
    }
    /**
     * @param {?} mappingFileNames
     * @param {?} mappingDefinition
     * @return {?}
     */
    fetchMappings(mappingFileNames, mappingDefinition) {
        return new Observable$1((observer) => {
            if (mappingFileNames.length == 0) {
                observer.complete();
                return;
            }
            const /** @type {?} */ baseURL = this.cfg.initCfg.baseMappingServiceUrl + 'mapping/';
            const /** @type {?} */ operations = [];
            for (const /** @type {?} */ mappingName of mappingFileNames) {
                const /** @type {?} */ url = baseURL + mappingName;
                DataMapperUtil.debugLogJSON(null, 'Mapping Service Request', this.cfg.initCfg.debugMappingServiceCalls, url);
                const /** @type {?} */ operation = this.http.get(url).map((res) => res.json());
                operations.push(operation);
            }
            Observable$1.forkJoin(operations).subscribe((data) => {
                if (!data) {
                    observer.next(false);
                    observer.complete();
                    return;
                }
                for (const /** @type {?} */ d of data) {
                    DataMapperUtil.debugLogJSON(d, 'Mapping Service Response', this.cfg.initCfg.debugMappingServiceCalls, null);
                    MappingSerializer.deserializeMappingServiceJSON(d, mappingDefinition, this.cfg);
                }
                this.notifyMappingUpdated();
                observer.next(true);
                observer.complete();
            }, (error) => {
                observer.error(error);
                observer.complete();
            });
        });
    }
    /**
     * @return {?}
     */
    saveCurrentMapping() {
        const /** @type {?} */ activeMapping = this.cfg.mappings.activeMapping;
        if ((activeMapping != null) && (this.cfg.mappings.mappings.indexOf(activeMapping) == -1)) {
            this.cfg.mappings.mappings.push(activeMapping);
        }
        const /** @type {?} */ newMappings = [];
        for (const /** @type {?} */ mapping of this.cfg.mappings.mappings) {
            if (mapping.hasFullyMappedPair()) {
                newMappings.push(mapping);
            }
        }
        this.cfg.mappings.mappings = newMappings;
        this.saveMappingSource.next(null);
    }
    /**
     * @return {?}
     */
    serializeMappingsToJSON() {
        return MappingSerializer.serializeMappings(this.cfg);
    }
    /**
     * @return {?}
     */
    saveMappingToService() {
        const /** @type {?} */ payload = this.serializeMappingsToJSON();
        const /** @type {?} */ url = this.cfg.initCfg.baseMappingServiceUrl + 'mapping';
        DataMapperUtil.debugLogJSON(payload, 'Mapping Service Request', this.cfg.initCfg.debugMappingServiceCalls, url);
        this.http.put(url, JSON.stringify(payload), { headers: this.headers }).toPromise()
            .then((res) => {
            DataMapperUtil.debugLogJSON(res, 'Mapping Service Response', this.cfg.initCfg.debugMappingServiceCalls, url);
        })
            .catch((error) => { this.handleError('Error occurred while saving mapping.', error); });
    }
    /**
     * @param {?} saveHandler
     * @return {?}
     */
    handleMappingSaveSuccess(saveHandler) {
        if (saveHandler != null) {
            saveHandler();
        }
        this.notifyMappingUpdated();
    }
    /**
     * @param {?} mappingModel
     * @return {?}
     */
    removeMapping(mappingModel) {
        const /** @type {?} */ mappingWasSaved = this.cfg.mappings.removeMapping(mappingModel);
        if (mappingWasSaved) {
            const /** @type {?} */ saveHandler = (() => {
                this.deselectMapping();
            });
            this.saveMappingSource.next(saveHandler);
        }
        else {
            this.deselectMapping();
        }
    }
    /**
     * @param {?} fieldPair
     * @return {?}
     */
    removeMappedPair(fieldPair) {
        this.cfg.mappings.activeMapping.removeMappedPair(fieldPair);
        if (this.cfg.mappings.activeMapping.fieldMappings.length == 0) {
            this.deselectMapping();
        }
        else {
            this.notifyMappingUpdated();
        }
        this.saveCurrentMapping();
    }
    /**
     * @return {?}
     */
    addMappedPair() {
        const /** @type {?} */ fieldPair = new FieldMappingPair();
        this.cfg.mappings.activeMapping.fieldMappings.push(fieldPair);
        this.notifyMappingUpdated();
        this.saveCurrentMapping();
        return fieldPair;
    }
    /**
     * @param {?} fieldPair
     * @return {?}
     */
    updateMappedField(fieldPair) {
        fieldPair.updateTransition();
        this.notifyMappingUpdated();
        this.saveCurrentMapping();
    }
    /**
     * @param {?} field
     * @return {?}
     */
    fieldSelected(field) {
        if (!field.isTerminal()) {
            field.docDef.populateChildren(field);
            field.docDef.updateFromMappings(this.cfg.mappings, this.cfg);
            field.collapsed = !field.collapsed;
            return;
        }
        let /** @type {?} */ mapping = this.cfg.mappings.activeMapping;
        if (mapping != null
            && mapping.hasMappedFields(field.isSource())
            && !mapping.isFieldMapped(field, field.isSource())) {
            mapping = null;
        }
        if (mapping == null) {
            const /** @type {?} */ mappingsForField = this.cfg.mappings.findMappingsForField(field);
            if (mappingsForField && mappingsForField.length > 1) {
                this.mappingSelectionRequiredSource.next(field);
                return;
            }
            else if (mappingsForField && mappingsForField.length == 1) {
                mapping = mappingsForField[0];
            }
        }
        if (mapping == null) {
            this.addNewMapping(field);
            return;
        }
        //check to see if field is a valid selection for this mapping
        const /** @type {?} */ exclusionReason = mapping.getFieldSelectionExclusionReason(field);
        if (exclusionReason != null) {
            this.cfg.errorService.warn("The field '" + field.displayName + "' cannot be selected, " + exclusionReason + '.', null);
            return;
        }
        mapping.brandNewMapping = false;
        const /** @type {?} */ latestFieldPair = mapping.getCurrentFieldMapping();
        const /** @type {?} */ lastMappedField = latestFieldPair.getLastMappedField(field.isSource());
        if ((lastMappedField != null)) {
            lastMappedField.field = field;
        }
        latestFieldPair.updateTransition();
        this.selectMapping(mapping);
    }
    /**
     * @param {?} selectedField
     * @return {?}
     */
    addNewMapping(selectedField) {
        this.deselectMapping();
        const /** @type {?} */ mapping = new MappingModel();
        mapping.brandNewMapping = false;
        if (selectedField != null) {
            const /** @type {?} */ fieldPair = mapping.getFirstFieldMapping();
            fieldPair.getMappedFields(selectedField.isSource())[0].field = selectedField;
            fieldPair.updateTransition();
        }
        this.selectMapping(mapping);
    }
    /**
     * @param {?} mappingModel
     * @return {?}
     */
    selectMapping(mappingModel) {
        if (mappingModel == null) {
            this.deselectMapping();
            return;
        }
        this.cfg.mappings.activeMapping = mappingModel;
        this.cfg.showMappingDetailTray = true;
        for (const /** @type {?} */ fieldPair of mappingModel.fieldMappings) {
            DocumentDefinition.selectFields(fieldPair.getAllFields());
        }
        this.cfg.mappings.initializeMappingLookupTable(mappingModel);
        this.saveCurrentMapping();
        this.notifyMappingUpdated();
    }
    /**
     * @return {?}
     */
    deselectMapping() {
        this.cfg.showMappingDetailTray = false;
        this.cfg.mappings.activeMapping = null;
        for (const /** @type {?} */ doc of this.cfg.getAllDocs()) {
            doc.clearSelectedFields();
        }
        this.notifyMappingUpdated();
    }
    /**
     * @return {?}
     */
    validateMappings() {
        if (this.cfg.initCfg.baseMappingServiceUrl == null) {
            //validation service not configured.
            return;
        }
        const /** @type {?} */ payload = MappingSerializer.serializeMappings(this.cfg);
        const /** @type {?} */ url = this.cfg.initCfg.baseMappingServiceUrl + 'mapping/validate';
        DataMapperUtil.debugLogJSON(payload, 'Validation Service Request', this.cfg.initCfg.debugValidationServiceCalls, url);
        this.http.put(url, payload, { headers: this.headers }).toPromise()
            .then((res) => {
            DataMapperUtil.debugLogJSON(res, 'Validation Service Response', this.cfg.initCfg.debugValidationServiceCalls, url);
            const /** @type {?} */ mapping = this.cfg.mappings.activeMapping;
            const /** @type {?} */ body = res.json();
            const /** @type {?} */ activeMappingErrors = [];
            const /** @type {?} */ globalErrors = [];
            // Only update active mapping and global ones, since validateMappings() is always invoked when mapping is updated.
            // This should be eventually turned into mapping entry level validation.
            // https://github.com/atlasmap/atlasmap-ui/issues/116
            if (body && body.Validations && body.Validations.validation) {
                for (const /** @type {?} */ validation of body.Validations.validation) {
                    let /** @type {?} */ level = ErrorLevel.VALIDATION_ERROR;
                    if (validation.status === 'WARN') {
                        level = ErrorLevel.WARN;
                    }
                    else if (validation.status === 'INFO') {
                        level = ErrorLevel.INFO;
                    }
                    const /** @type {?} */ errorInfo = new ErrorInfo(validation.message, level);
                    if (!validation.scope || validation.scope != 'MAPPING' || !validation.id) {
                        globalErrors.push(errorInfo);
                    }
                    else if (mapping && mapping.uuid && validation.id === mapping.uuid) {
                        activeMappingErrors.push(errorInfo);
                    }
                }
            }
            this.cfg.validationErrors = globalErrors;
            if (mapping) {
                mapping.validationErrors = activeMappingErrors;
            }
        })
            .catch((error) => {
            this.cfg.errorService.error('Error fetching validation data.', { 'error': error, 'url': url, 'request': payload });
        });
    }
    /**
     * @return {?}
     */
    fetchFieldActions() {
        return new Observable$1((observer) => {
            let /** @type {?} */ actionConfigs = [];
            const /** @type {?} */ url = this.cfg.initCfg.baseMappingServiceUrl + 'fieldActions';
            DataMapperUtil.debugLogJSON(null, 'Field Action Config Request', this.cfg.initCfg.debugFieldActionServiceCalls, url);
            this.http.get(url, { headers: this.headers }).toPromise()
                .then((res) => {
                const /** @type {?} */ body = res.json();
                DataMapperUtil.debugLogJSON(body, 'Field Action Config Response', this.cfg.initCfg.debugFieldActionServiceCalls, url);
                if (body && body.ActionDetails
                    && body.ActionDetails.actionDetail
                    && body.ActionDetails.actionDetail.length) {
                    for (const /** @type {?} */ svcConfig of body.ActionDetails.actionDetail) {
                        const /** @type {?} */ fieldActionConfig = new FieldActionConfig();
                        fieldActionConfig.name = svcConfig.name;
                        fieldActionConfig.sourceType = svcConfig.sourceType;
                        fieldActionConfig.targetType = svcConfig.targetType;
                        fieldActionConfig.method = svcConfig.method;
                        fieldActionConfig.serviceObject = svcConfig;
                        if (svcConfig.parameters && svcConfig.parameters.property
                            && svcConfig.parameters.property.length) {
                            for (const /** @type {?} */ svcProperty of svcConfig.parameters.property) {
                                const /** @type {?} */ argumentConfig = new FieldActionArgument();
                                argumentConfig.name = svcProperty.name;
                                argumentConfig.type = svcProperty.fieldType;
                                argumentConfig.serviceObject = svcProperty;
                                fieldActionConfig.arguments.push(argumentConfig);
                            }
                        }
                        actionConfigs.push(fieldActionConfig);
                    }
                }
                actionConfigs = this.sortFieldActionConfigs(actionConfigs);
                observer.next(actionConfigs);
                observer.complete();
            })
                .catch((error) => {
                observer.error(error);
                observer.next(actionConfigs);
                observer.complete();
            });
        });
    }
    /**
     * @param {?} configs
     * @return {?}
     */
    sortFieldActionConfigs(configs) {
        const /** @type {?} */ sortedActionConfigs = [];
        if (configs == null || configs.length == 0) {
            return sortedActionConfigs;
        }
        const /** @type {?} */ configsByName = {};
        const /** @type {?} */ configNames = [];
        for (const /** @type {?} */ fieldActionConfig of configs) {
            const /** @type {?} */ name = fieldActionConfig.name;
            //if field is a dupe, discard it
            if (configsByName[name] != null) {
                continue;
            }
            configsByName[name] = fieldActionConfig;
            configNames.push(name);
        }
        configNames.sort();
        for (const /** @type {?} */ name of configNames) {
            sortedActionConfigs.push(configsByName[name]);
        }
        return sortedActionConfigs;
    }
    /**
     * @return {?}
     */
    notifyMappingUpdated() {
        if (this.cfg.mappings.mappings.length > 0) {
            this.validateMappings();
        }
        this.mappingUpdatedSource.next();
    }
    /**
     * @param {?} message
     * @param {?} error
     * @return {?}
     */
    handleError(message, error) {
        this.cfg.errorService.error(message, error);
    }
}
MappingManagementService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MappingManagementService.ctorParameters = () => [
    { type: Http, },
];

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class ErrorHandlerService {
    constructor() {
        this.cfg = null;
    }
    /**
     * @param {?} message
     * @param {?} error
     * @return {?}
     */
    debug(message, error) { this.addError(message, ErrorLevel.DEBUG, error); }
    /**
     * @param {?} message
     * @param {?} error
     * @return {?}
     */
    info(message, error) { this.addError(message, ErrorLevel.INFO, error); }
    /**
     * @param {?} message
     * @param {?} error
     * @return {?}
     */
    warn(message, error) { this.addError(message, ErrorLevel.WARN, error); }
    /**
     * @param {?} message
     * @param {?} error
     * @return {?}
     */
    error(message, error) { this.addError(message, ErrorLevel.ERROR, error); }
    /**
     * @param {?} message
     * @param {?} error
     * @return {?}
     */
    validationError(message, error) { this.addValidationError(message, error); }
    /**
     * @param {?} identifier
     * @return {?}
     */
    removeError(identifier) {
        this.cfg.errors = this.cfg.errors.filter(e => e.identifier !== identifier);
        this.cfg.validationErrors = this.cfg.validationErrors.filter(e => e.identifier !== identifier);
    }
    /**
     * @return {?}
     */
    clearValidationErrors() {
        this.cfg.validationErrors = [];
    }
    /**
     * @param {?} message
     * @param {?} level
     * @param {?} error
     * @return {?}
     */
    addError(message, level, error) {
        if (this.arrayDoesNotContainError(message)) {
            const /** @type {?} */ e = new ErrorInfo(message, level, error);
            this.cfg.errors.push(e);
        }
    }
    /**
     * @param {?} message
     * @return {?}
     */
    arrayDoesNotContainError(message) {
        return this.cfg.errors.filter(e => e.message === message).length === 0;
    }
    /**
     * @param {?} message
     * @param {?} error
     * @return {?}
     */
    addValidationError(message, error) {
        const /** @type {?} */ e = new ErrorInfo(message, ErrorLevel.VALIDATION_ERROR, error);
        this.cfg.validationErrors.push(e);
    }
}
ErrorHandlerService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ErrorHandlerService.ctorParameters = () => [];

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class MappingDefinition {
    constructor() {
        this.name = null;
        this.mappings = [];
        this.activeMapping = null;
        this.parsedDocs = [];
        this.templateText = null;
        this.tables = [];
        this.tablesBySourceTargetKey = {};
        this.tablesByName = {};
        this.name = 'UI.' + Math.floor((Math.random() * 1000000) + 1).toString();
    }
    /**
     * @return {?}
     */
    templateExists() {
        return ((this.templateText != null) && (this.templateText != ''));
    }
    /**
     * @param {?} table
     * @return {?}
     */
    addTable(table) {
        this.tablesBySourceTargetKey[table.getInputOutputKey()] = table;
        this.tablesByName[table.name] = table;
        this.tables.push(table);
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getTableByName(name) {
        return this.tablesByName[name];
    }
    /**
     * @return {?}
     */
    detectTableIdentifiers() {
        for (const /** @type {?} */ t of this.getTables()) {
            if (t.sourceIdentifier && t.targetIdentifier) {
                continue;
            }
            const /** @type {?} */ m = this.getFirstMappingForLookupTable(t.name);
            if (m != null) {
                for (const /** @type {?} */ fieldPair of m.fieldMappings) {
                    if (fieldPair.transition.lookupTableName == null) {
                        continue;
                    }
                    if (!t.sourceIdentifier) {
                        const /** @type {?} */ inputField = fieldPair.getFields(true)[0];
                        if (inputField) {
                            t.sourceIdentifier = inputField.classIdentifier;
                            
                        }
                    }
                    if (!t.targetIdentifier) {
                        const /** @type {?} */ outputField = fieldPair.getFields(false)[0];
                        if (outputField) {
                            t.targetIdentifier = outputField.classIdentifier;
                            
                        }
                    }
                }
            }
        }
        for (const /** @type {?} */ m of this.mappings) {
            this.initializeMappingLookupTable(m);
        }
    }
    /**
     * @param {?} sourceIdentifier
     * @param {?} targetIdentifier
     * @return {?}
     */
    getTableBySourceTarget(sourceIdentifier, targetIdentifier) {
        const /** @type {?} */ key = sourceIdentifier + ':' + targetIdentifier;
        return this.tablesBySourceTargetKey[key];
    }
    /**
     * @return {?}
     */
    getTables() {
        const /** @type {?} */ tables = [];
        for (const /** @type {?} */ key in this.tablesByName) {
            if (!this.tablesByName.hasOwnProperty(key)) {
                continue;
            }
            const /** @type {?} */ table = this.tablesByName[key];
            tables.push(table);
        }
        return tables;
    }
    /**
     * @param {?} lookupTableName
     * @return {?}
     */
    getFirstMappingForLookupTable(lookupTableName) {
        for (const /** @type {?} */ m of this.mappings) {
            for (const /** @type {?} */ fieldPair of m.fieldMappings) {
                if (fieldPair.transition.lookupTableName == lookupTableName) {
                    return m;
                }
            }
        }
        return null;
    }
    /**
     * @param {?} cfg
     * @return {?}
     */
    removeStaleMappings(cfg) {
        let /** @type {?} */ index = 0;
        let /** @type {?} */ sourceFieldPaths = [];
        for (const /** @type {?} */ doc of cfg.getDocs(true)) {
            sourceFieldPaths = sourceFieldPaths.concat(Field.getFieldPaths(doc.getAllFields()));
        }
        let /** @type {?} */ targetSourcePaths = [];
        for (const /** @type {?} */ doc of cfg.getDocs(false)) {
            targetSourcePaths = targetSourcePaths.concat(Field.getFieldPaths(doc.getAllFields()));
        }
        while (index < this.mappings.length) {
            const /** @type {?} */ mapping = this.mappings[index];
            const /** @type {?} */ mappingIsStale = this.isMappingStale(mapping, sourceFieldPaths, targetSourcePaths);
            if (mappingIsStale) {
                this.mappings.splice(index, 1);
            }
            else {
                index++;
            }
        }
    }
    /**
     * @param {?} mapping
     * @param {?} sourceFieldPaths
     * @param {?} targetSourcePaths
     * @return {?}
     */
    isMappingStale(mapping, sourceFieldPaths, targetSourcePaths) {
        for (const /** @type {?} */ field of mapping.getFields(true)) {
            if (sourceFieldPaths.indexOf(field.path) == -1) {
                return true;
            }
        }
        for (const /** @type {?} */ field of mapping.getFields(false)) {
            if (targetSourcePaths.indexOf(field.path) == -1) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} m
     * @return {?}
     */
    initializeMappingLookupTable(m) {
        for (const /** @type {?} */ fieldPair of m.fieldMappings) {
            if (!(fieldPair.transition.mode == TransitionMode.ENUM
                && fieldPair.transition.lookupTableName == null
                && fieldPair.getFields(true).length == 1
                && fieldPair.getFields(false).length == 1)) {
                return;
            }
            let /** @type {?} */ inputClassIdentifier = null;
            let /** @type {?} */ outputClassIdentifier = null;
            const /** @type {?} */ inputField = fieldPair.getFields(true)[0];
            if (inputField) {
                inputClassIdentifier = inputField.classIdentifier;
            }
            const /** @type {?} */ outputField = fieldPair.getFields(true)[0];
            if (outputField) {
                outputClassIdentifier = outputField.classIdentifier;
            }
            if (inputClassIdentifier && outputClassIdentifier) {
                let /** @type {?} */ table = this.getTableBySourceTarget(inputClassIdentifier, outputClassIdentifier);
                if (table == null) {
                    table = new LookupTable();
                    table.sourceIdentifier = inputClassIdentifier;
                    table.targetIdentifier = outputClassIdentifier;
                    this.addTable(table);
                    fieldPair.transition.lookupTableName = table.name;
                }
                else {
                    fieldPair.transition.lookupTableName = table.name;
                }
            }
        }
    }
    /**
     * @param {?} cfg
     * @return {?}
     */
    updateMappingsFromDocuments(cfg) {
        const /** @type {?} */ sourceDocMap = {};
        for (const /** @type {?} */ doc of cfg.getDocs(true)) {
            sourceDocMap[doc.uri] = doc;
        }
        const /** @type {?} */ targetDocMap = {};
        for (const /** @type {?} */ doc of cfg.getDocs(false)) {
            targetDocMap[doc.uri] = doc;
        }
        for (const /** @type {?} */ mapping of this.mappings) {
            for (const /** @type {?} */ fieldPair of mapping.fieldMappings) {
                this.updateMappedFieldsFromDocuments(fieldPair, cfg, sourceDocMap, true);
                this.updateMappedFieldsFromDocuments(fieldPair, cfg, targetDocMap, false);
            }
        }
        for (const /** @type {?} */ doc of cfg.getAllDocs()) {
            if (doc.initCfg.shortIdentifier == null) {
                doc.initCfg.shortIdentifier = 'DOC.' + doc.name + '.' + Math.floor((Math.random() * 1000000) + 1).toString();
            }
        }
    }
    /**
     * @param {?} cfg
     * @return {?}
     */
    updateDocumentNamespacesFromMappings(cfg) {
        const /** @type {?} */ docs = cfg.getDocs(false);
        for (const /** @type {?} */ parsedDoc of this.parsedDocs) {
            if (parsedDoc.isSource) {
                continue;
            }
            if (parsedDoc.namespaces.length == 0) {
                continue;
            }
            const /** @type {?} */ doc = DocumentDefinition.getDocumentByIdentifier(parsedDoc.initCfg.documentIdentifier, docs);
            if (doc == null) {
                cfg.errorService.error("Could not find document with identifier '" + parsedDoc.initCfg.documentIdentifier
                    + "' for namespace override.", { 'identifier': parsedDoc.initCfg.documentIdentifier, 'parsedDoc': parsedDoc, 'docs': docs });
                continue;
            }
            doc.namespaces = [].concat(parsedDoc.namespaces);
        }
    }
    /**
     * @param {?} includeActiveMapping
     * @return {?}
     */
    getAllMappings(includeActiveMapping) {
        const /** @type {?} */ mappings = [].concat(this.mappings);
        if (includeActiveMapping) {
            if (this.activeMapping == null) {
                return mappings;
            }
            for (const /** @type {?} */ mapping of mappings) {
                if (mapping == this.activeMapping) {
                    return mappings;
                }
            }
            mappings.push(this.activeMapping);
        }
        return mappings;
    }
    /**
     * @param {?} field
     * @return {?}
     */
    findMappingsForField(field) {
        const /** @type {?} */ mappingsForField = [];
        for (const /** @type {?} */ m of this.mappings) {
            if (m.isFieldMapped(field, field.isSource())) {
                mappingsForField.push(m);
            }
        }
        return mappingsForField;
    }
    /**
     * @param {?} m
     * @return {?}
     */
    removeMapping(m) {
        return DataMapperUtil.removeItemFromArray(m, this.mappings);
    }
    /**
     * @param {?} field
     * @return {?}
     */
    removeFieldFromAllMappings(field) {
        for (const /** @type {?} */ mapping of this.getAllMappings(true)) {
            for (const /** @type {?} */ fieldPair of mapping.fieldMappings) {
                const /** @type {?} */ mappedField = fieldPair.getMappedFieldForField(field, field.isSource());
                if (mappedField != null) {
                    mappedField.field = DocumentDefinition.getNoneField();
                }
            }
        }
    }
    /**
     * @param {?} fieldPair
     * @param {?} cfg
     * @param {?} docMap
     * @param {?} isSource
     * @return {?}
     */
    updateMappedFieldsFromDocuments(fieldPair, cfg, docMap, isSource) {
        const /** @type {?} */ mappedFields = fieldPair.getMappedFields(isSource);
        for (const /** @type {?} */ mappedField of mappedFields) {
            let /** @type {?} */ doc = null;
            if (mappedField.parsedData.fieldIsProperty) {
                doc = cfg.propertyDoc;
            }
            else if (mappedField.parsedData.fieldIsConstant) {
                doc = cfg.constantDoc;
            }
            else {
                doc = (docMap[mappedField.parsedData.parsedDocURI]);
                if (doc == null) {
                    cfg.errorService.error('Could not find doc for mapped field.', mappedField);
                    continue;
                }
                if (mappedField.parsedData.parsedDocID == null) {
                    cfg.errorService.error('Could not find doc ID for mapped field.', mappedField);
                    continue;
                }
                doc.initCfg.shortIdentifier = mappedField.parsedData.parsedDocID;
            }
            mappedField.field = null;
            if (!mappedField.parsedData.userCreated) {
                mappedField.field = doc.getField(mappedField.parsedData.parsedPath);
            }
            if (mappedField.field == null) {
                if (mappedField.parsedData.fieldIsConstant) {
                    const /** @type {?} */ constantField = new Field();
                    constantField.value = mappedField.parsedData.parsedValue;
                    constantField.type = mappedField.parsedData.parsedValueType;
                    constantField.displayName = constantField.value;
                    constantField.name = constantField.value;
                    constantField.path = constantField.value;
                    constantField.userCreated = true;
                    mappedField.field = constantField;
                    doc.addField(constantField);
                }
                else if (mappedField.parsedData.userCreated) {
                    const /** @type {?} */ path = mappedField.parsedData.parsedPath;
                    mappedField.field = new Field();
                    mappedField.field.serviceObject.jsonType = 'io.atlasmap.xml.v2.XmlField';
                    mappedField.field.path = path;
                    mappedField.field.type = mappedField.parsedData.parsedValueType;
                    mappedField.field.userCreated = true;
                    const /** @type {?} */ lastSeparator = path.lastIndexOf('/');
                    const /** @type {?} */ parentPath = (lastSeparator > 0) ? path.substring(0, lastSeparator) : null;
                    let /** @type {?} */ fieldName = (lastSeparator == -1) ? path : path.substring(lastSeparator + 1);
                    let /** @type {?} */ namespaceAlias = null;
                    if (fieldName.indexOf(':') != -1) {
                        namespaceAlias = fieldName.split(':')[0];
                        fieldName = fieldName.split(':')[1];
                    }
                    mappedField.field.name = fieldName;
                    mappedField.field.displayName = fieldName;
                    mappedField.field.isAttribute = (fieldName.indexOf('@') != -1);
                    mappedField.field.namespaceAlias = namespaceAlias;
                    if (parentPath != null) {
                        mappedField.field.parentField = doc.getField(parentPath);
                    }
                    if (mappedField.field.parentField == null) {
                        mappedField.field.parentField = DocumentDefinition.getNoneField();
                    }
                    doc.addField(mappedField.field);
                }
                else {
                    cfg.errorService.error('Could not find field from doc for mapped field.', { 'mappedField': mappedField, 'doc': doc });
                    mappedField.field = DocumentDefinition.getNoneField();
                    return;
                }
            }
            if (mappedField.parsedData.parsedActions.length > 0) {
                for (const /** @type {?} */ action of mappedField.parsedData.parsedActions) {
                    const /** @type {?} */ actionConfig = TransitionModel.getActionConfigForName(action.name);
                    if (actionConfig == null) {
                        cfg.errorService.error("Could not find field action config for action name '" + action.name + "'", null);
                        continue;
                    }
                    actionConfig.populateFieldAction(action);
                    mappedField.actions.push(action);
                }
            }
            const /** @type {?} */ isSeparate = fieldPair.transition.isSeparateMode();
            const /** @type {?} */ isCombine = fieldPair.transition.isCombineMode();
            const /** @type {?} */ index = mappedField.parsedData.parsedIndex;
            mappedField.updateSeparateOrCombineIndex(isSeparate, isCombine, index, isSource);
        }
    }
}

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class InitializationService {
    /**
     * @param {?} documentService
     * @param {?} mappingService
     * @param {?} errorService
     */
    constructor(documentService, mappingService, errorService) {
        this.documentService = documentService;
        this.mappingService = mappingService;
        this.errorService = errorService;
        this.cfg = ConfigModel.getConfig();
        this.systemInitializedSource = new Subject$1();
        this.systemInitialized$ = this.systemInitializedSource.asObservable();
        this.initializationStatusChangedSource = new Subject$1();
        this.initializationStatusChanged$ = this.initializationStatusChangedSource.asObservable();
        this.resetConfig();
        this.cfg.documentService.initialize();
        this.cfg.mappingService.initialize();
    }
    /**
     * @return {?}
     */
    resetConfig() {
        this.cfg = new ConfigModel();
        this.cfg.documentService = this.documentService;
        this.cfg.documentService.cfg = this.cfg;
        this.cfg.mappingService = this.mappingService;
        this.cfg.mappingService.cfg = this.cfg;
        this.cfg.errorService = this.errorService;
        this.cfg.errorService.cfg = this.cfg;
        this.cfg.initializationService = this;
        ConfigModel.setConfig(this.cfg);
    }
    /**
     * @return {?}
     */
    initialize() {
        if (this.cfg.mappingService == null) {
            this.cfg.errorService.warn('Mapping service is not configured, validation service will not be used.', null);
        }
        else if (this.cfg.initCfg.baseMappingServiceUrl == null) {
            this.cfg.errorService.warn('Mapping service URL is not configured, validation service will not be used.', null);
        }
        if (this.cfg.initCfg.discardNonMockSources) {
            this.cfg.sourceDocs = [];
            this.cfg.targetDocs = [];
        }
        if (this.cfg.initCfg.addMockJSONMappings) {
            const /** @type {?} */ mappingDefinition = new MappingDefinition();
            const /** @type {?} */ mappingJSON = InitializationService.createExampleMappingsJSON();
            MappingSerializer.deserializeMappingServiceJSON(mappingJSON, mappingDefinition, this.cfg);
            this.cfg.mappings = mappingDefinition;
        }
        if (this.cfg.initCfg.addMockJavaSources || this.cfg.initCfg.addMockJavaSingleSource) {
            this.cfg.addJavaDocument('io.atlasmap.java.test.TargetTestClass', true);
            if (this.cfg.initCfg.addMockJavaSources) {
                this.cfg.addJavaDocument('io.atlasmap.java.test.SourceContact', true);
                this.cfg.addJavaDocument('io.atlasmap.java.test.SourceAddress', true);
                this.cfg.addJavaDocument('io.atlasmap.java.test.TestListOrders', true);
                this.cfg.addJavaDocument('io.atlasmap.java.test.TargetOrderArray', true);
                this.cfg.addJavaDocument('io.atlasmap.java.test.SourceFlatPrimitiveClass', true);
                this.cfg.addJavaDocument('io.atlasmap.java.test.SourceOrder', true);
            }
        }
        if (this.cfg.initCfg.addMockJavaCachedSource) {
            const /** @type {?} */ docDef = this.cfg.addJavaDocument('io.atlasmap.java.test.Name', true);
            docDef.initCfg.inspectionResultContents = DocumentManagementService.generateMockJavaDoc();
        }
        if (this.cfg.initCfg.addMockXMLInstanceSources) {
            this.cfg.addXMLInstanceDocument('XMLInstanceSource', DocumentManagementService.generateMockInstanceXMLDoc(), true);
        }
        if (this.cfg.initCfg.addMockXMLSchemaSources) {
            this.cfg.addXMLSchemaDocument('XMLSchemaSource', DocumentManagementService.generateMockSchemaXMLDoc(), true);
        }
        if (this.cfg.initCfg.addMockJSONSources || this.cfg.initCfg.addMockJSONInstanceSources) {
            this.cfg.addJSONInstanceDocument('JSONInstanceSource', DocumentManagementService.generateMockJSONInstanceDoc(), true);
        }
        if (this.cfg.initCfg.addMockJSONSchemaSources) {
            this.cfg.addJSONSchemaDocument('JSONSchemaSource', DocumentManagementService.generateMockJSONSchemaDoc(), true);
        }
        if (this.cfg.initCfg.addMockJavaTarget) {
            this.cfg.addJavaDocument('io.atlasmap.java.test.TargetTestClass', false);
        }
        if (this.cfg.initCfg.addMockJavaCachedTarget) {
            const /** @type {?} */ docDef = this.cfg.addJavaDocument('io.atlasmap.java.test.Name', false);
            docDef.initCfg.inspectionResultContents = DocumentManagementService.generateMockJavaDoc();
        }
        if (this.cfg.initCfg.addMockXMLInstanceTarget) {
            this.cfg.addXMLInstanceDocument('XMLInstanceTarget', DocumentManagementService.generateMockInstanceXMLDoc(), false);
        }
        if (this.cfg.initCfg.addMockXMLSchemaTarget) {
            this.cfg.addXMLSchemaDocument('XMLSchemaTarget', DocumentManagementService.generateMockSchemaXMLDoc(), false);
        }
        if (this.cfg.initCfg.addMockJSONTarget || this.cfg.initCfg.addMockJSONInstanceTarget) {
            this.cfg.addJSONInstanceDocument('JSONInstanceTarget', DocumentManagementService.generateMockJSONInstanceDoc(), false);
        }
        if (this.cfg.initCfg.addMockJSONSchemaTarget) {
            this.cfg.addJSONSchemaDocument('JSONSchemaTarget', DocumentManagementService.generateMockJSONSchemaDoc(), false);
        }
        //load field actions
        this.fetchFieldActions();
        //load documents
        if (!this.cfg.isClassPathResolutionNeeded()) {
            this.fetchDocuments();
        }
        else {
            this.updateLoadingStatus('Loading Maven class path.');
            //fetch class path
            this.cfg.documentService.fetchClassPath().subscribe((classPath) => {
                this.cfg.initCfg.classPath = classPath;
                this.fetchDocuments();
                this.updateStatus();
            }, (error) => { this.handleError('could not load Maven class path.', error); });
        }
        //load mappings
        if (this.cfg.mappings != null) {
            this.cfg.initCfg.mappingInitialized = true;
            this.updateStatus();
        }
        else {
            this.cfg.mappings = new MappingDefinition();
            if (this.cfg.mappingFiles.length > 0) {
                this.fetchMappings(this.cfg.mappingFiles);
            }
            else {
                this.cfg.mappingService.findMappingFiles('UI').subscribe((files) => { this.fetchMappings(files); }, (error) => { this.handleError('could not load mapping files.', error); });
            }
        }
    }
    /**
     * @return {?}
     */
    fetchDocuments() {
        this.updateLoadingStatus('Loading source/target documents.');
        for (const /** @type {?} */ docDef of this.cfg.getAllDocs()) {
            if (docDef == this.cfg.propertyDoc || docDef == this.cfg.constantDoc) {
                docDef.initCfg.initialized = true;
                continue;
            }
            const /** @type {?} */ docName = docDef.initCfg.shortIdentifier;
            if (docDef.initCfg.type.isJava() && this.cfg.initCfg.baseJavaInspectionServiceUrl == null) {
                this.cfg.errorService.warn('Java inspection service is not configured. Document will not be loaded: ' + docName, docDef);
                docDef.initCfg.initialized = true;
                this.updateStatus();
                continue;
            }
            else if (docDef.initCfg.type.isXML() && this.cfg.initCfg.baseXMLInspectionServiceUrl == null) {
                this.cfg.errorService.warn('XML inspection service is not configured. Document will not be loaded: ' + docName, docDef);
                docDef.initCfg.initialized = true;
                this.updateStatus();
                continue;
            }
            else if (docDef.initCfg.type.isJSON() && this.cfg.initCfg.baseJSONInspectionServiceUrl == null) {
                this.cfg.errorService.warn('JSON inspection service is not configured. Document will not be loaded: ' + docName, docDef);
                docDef.initCfg.initialized = true;
                this.updateStatus();
                continue;
            }
            this.cfg.documentService.fetchDocument(docDef, this.cfg.initCfg.classPath).subscribe((doc) => {
                this.updateStatus();
            }, (error) => {
                this.handleError("Could not load document '"
                    + docDef.initCfg.documentIdentifier + "'.", error);
            });
        }
    }
    /**
     * @param {?} mappingFiles
     * @return {?}
     */
    fetchMappings(mappingFiles) {
        if (mappingFiles.length == 0) {
            this.cfg.initCfg.mappingInitialized = true;
            this.updateStatus();
            return;
        }
        this.cfg.mappingService.fetchMappings(mappingFiles, this.cfg.mappings).subscribe((result) => {
            this.cfg.initCfg.mappingInitialized = true;
            this.updateStatus();
        }, (error) => { this.handleError('could not load mapping definitions.', error); });
    }
    /**
     * @return {?}
     */
    fetchFieldActions() {
        if (this.cfg.mappingService == null) {
            this.cfg.errorService.warn('Mapping service is not provided. Field Actions will not be used.', null);
            this.cfg.initCfg.fieldActionsInitialized = true;
            this.updateStatus();
            return;
        }
        else if (this.cfg.initCfg.baseMappingServiceUrl == null) {
            this.cfg.errorService.warn('Mapping service URL is not provided. Field Actions will not be used.', null);
            this.cfg.initCfg.fieldActionsInitialized = true;
            this.updateStatus();
            return;
        }
        this.cfg.mappingService.fetchFieldActions().subscribe((actionConfigs) => {
            TransitionModel.actionConfigs = actionConfigs;
            this.cfg.initCfg.fieldActionsInitialized = true;
            this.updateStatus();
        }, (error) => { this.handleError('Could not load field action configs.', error); });
    }
    /**
     * @return {?}
     */
    updateStatus() {
        const /** @type {?} */ documentCount = this.cfg.getAllDocs().length;
        let /** @type {?} */ finishedDocCount = 0;
        for (const /** @type {?} */ docDef of this.cfg.getAllDocs()) {
            if (docDef.initCfg.initialized || docDef.initCfg.errorOccurred) {
                finishedDocCount++;
            }
        }
        if ((documentCount == finishedDocCount) && this.cfg.initCfg.mappingInitialized && this.cfg.initCfg.fieldActionsInitialized) {
            this.cfg.mappings.detectTableIdentifiers();
            this.cfg.mappings.updateDocumentNamespacesFromMappings(this.cfg);
            this.cfg.mappings.updateMappingsFromDocuments(this.cfg);
            for (const /** @type {?} */ d of this.cfg.getAllDocs()) {
                d.updateFromMappings(this.cfg.mappings, this.cfg);
            }
            this.cfg.mappings.removeStaleMappings(this.cfg);
            this.updateLoadingStatus('Initialization complete.');
            this.cfg.initCfg.initialized = true;
            this.systemInitializedSource.next();
        }
    }
    /**
     * @param {?} message
     * @param {?} error
     * @return {?}
     */
    handleError(message, error) {
        message = 'Data Mapper UI Initialization Error: ' + message;
        this.cfg.errorService.error(message, error);
        this.updateLoadingStatus(message);
        this.cfg.initCfg.initializationErrorOccurred = true;
        this.updateStatus();
    }
    /**
     * @param {?} status
     * @return {?}
     */
    updateLoadingStatus(status) {
        this.cfg.initCfg.loadingStatus = status;
        this.initializationStatusChangedSource.next();
    }
    /**
     * @return {?}
     */
    static createExamplePom() {
        const /** @type {?} */ pom = `
            <project xmlns="http://maven.apache.org/POM/4.0.0"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

                <modelVersion>4.0.0</modelVersion>
                <groupId>foo.bar</groupId>
                <artifactId>test.model</artifactId>
                <version>1.10.0</version>
                <packaging>jar</packaging>
                <name>Test :: Model</name>

                <dependencies>
                    <dependency>
                        <groupId>com.fasterxml.jackson.core</groupId>
                        <artifactId>jackson-annotations</artifactId>
                        <version>2.8.5</version>
                    </dependency>
                    <dependency>
                        <groupId>com.fasterxml.jackson.core</groupId>
                        <artifactId>jackson-databind</artifactId>
                        <version>2.8.5</version>
                    </dependency>
                    <dependency>
                        <groupId>com.fasterxml.jackson.core</groupId>
                        <artifactId>jackson-core</artifactId>
                        <version>2.8.5</version>
                    </dependency>
                </dependencies>
            </project>
        `;
        //pom = pom.replace(/\"/g, "\\\"");
        /*
        pom = pom.replace(/\n/g, "\\n");
        pom = pom.replace(/\t/g, "\\t");
        */
        return pom;
    }
    /**
     * @return {?}
     */
    static createExampleMappingsJSON() {
        const /** @type {?} */ json = {
            'AtlasMapping': {
                'jsonType': ConfigModel.mappingServicesPackagePrefix + '.AtlasMapping',
                'fieldMappings': {
                    'fieldMapping': [
                        {
                            'jsonType': ConfigModel.mappingServicesPackagePrefix + '.MapFieldMapping',
                            'inputField': {
                                'jsonType': ConfigModel.mappingServicesPackagePrefix + '.MappedField',
                                'field': {
                                    'jsonType': ConfigModel.javaServicesPackagePrefix + '.JavaField',
                                    'status': 'SUPPORTED',
                                    'modifiers': { 'modifier': [] },
                                    'name': 'text',
                                    'className': 'java.lang.String',
                                    'type': 'STRING',
                                    'getMethod': 'getText',
                                    'primitive': true,
                                    'array': false,
                                    'synthetic': false,
                                    'path': 'Text',
                                },
                                'fieldActions': null,
                            },
                            'outputField': {
                                'jsonType': ConfigModel.mappingServicesPackagePrefix + '.MappedField',
                                'field': {
                                    'jsonType': ConfigModel.javaServicesPackagePrefix + '.JavaField',
                                    'status': 'SUPPORTED',
                                    'modifiers': { 'modifier': ['PRIVATE'] },
                                    'name': 'Description',
                                    'className': 'java.lang.String',
                                    'type': 'STRING',
                                    'getMethod': 'getDescription',
                                    'setMethod': 'setDescription',
                                    'primitive': true,
                                    'array': false,
                                    'synthetic': false,
                                    'path': 'Description',
                                },
                                'fieldActions': null,
                            },
                        },
                        {
                            'jsonType': ConfigModel.mappingServicesPackagePrefix + '.SeparateFieldMapping',
                            'inputField': {
                                'jsonType': ConfigModel.mappingServicesPackagePrefix + '.MappedField',
                                'field': {
                                    'jsonType': ConfigModel.javaServicesPackagePrefix + '.JavaField',
                                    'status': 'SUPPORTED',
                                    'modifiers': { 'modifier': [] },
                                    'name': 'name',
                                    'className': 'java.lang.String',
                                    'type': 'STRING',
                                    'getMethod': 'getName',
                                    'primitive': true,
                                    'array': false,
                                    'synthetic': false,
                                    'path': 'User.Name',
                                },
                                'fieldActions': null,
                            },
                            'outputFields': {
                                'mappedField': [
                                    {
                                        'jsonType': ConfigModel.mappingServicesPackagePrefix + '.MappedField',
                                        'field': {
                                            'jsonType': ConfigModel.javaServicesPackagePrefix + '.JavaField',
                                            'status': 'SUPPORTED',
                                            'modifiers': { 'modifier': ['PRIVATE'] },
                                            'name': 'FirstName',
                                            'className': 'java.lang.String',
                                            'type': 'STRING',
                                            'getMethod': 'getFirstName',
                                            'setMethod': 'setFirstName',
                                            'primitive': true,
                                            'array': false,
                                            'synthetic': false,
                                            'path': 'FirstName',
                                        },
                                        'fieldActions': {
                                            'fieldAction': [{
                                                    'jsonType': ConfigModel.mappingServicesPackagePrefix + '.MapAction',
                                                    'index': 0,
                                                }],
                                        },
                                    },
                                    {
                                        'jsonType': ConfigModel.mappingServicesPackagePrefix + '.MappedField',
                                        'field': {
                                            'jsonType': ConfigModel.javaServicesPackagePrefix + '.JavaField',
                                            'status': 'SUPPORTED',
                                            'modifiers': {
                                                'modifier': ['PRIVATE']
                                            },
                                            'name': 'LastName',
                                            'className': 'java.lang.String',
                                            'type': 'STRING',
                                            'getMethod': 'getLastName',
                                            'setMethod': 'setLastName',
                                            'primitive': true,
                                            'array': false,
                                            'synthetic': false,
                                            'path': 'LastName',
                                        },
                                        'fieldActions': {
                                            'fieldAction': [{
                                                    'jsonType': ConfigModel.mappingServicesPackagePrefix + '.MapAction',
                                                    'index': 1,
                                                }],
                                        },
                                    },
                                ],
                            },
                            'strategy': 'SPACE',
                        },
                        {
                            'jsonType': ConfigModel.mappingServicesPackagePrefix + '.MapFieldMapping',
                            'inputField': {
                                'jsonType': ConfigModel.mappingServicesPackagePrefix + '.MappedField',
                                'field': {
                                    'jsonType': ConfigModel.javaServicesPackagePrefix + '.JavaField',
                                    'status': 'SUPPORTED',
                                    'modifiers': { 'modifier': [] },
                                    'name': 'screenName',
                                    'className': 'java.lang.String',
                                    'type': 'STRING',
                                    'getMethod': 'getScreenName',
                                    'primitive': true,
                                    'array': false,
                                    'synthetic': false,
                                    'path': 'User.ScreenName',
                                },
                                'fieldActions': null,
                            },
                            'outputField': {
                                'jsonType': ConfigModel.mappingServicesPackagePrefix + '.MappedField',
                                'field': {
                                    'jsonType': ConfigModel.javaServicesPackagePrefix + '.JavaField',
                                    'status': 'SUPPORTED',
                                    'modifiers': {
                                        'modifier': ['PRIVATE']
                                    },
                                    'name': 'Title',
                                    'className': 'java.lang.String',
                                    'type': 'STRING',
                                    'getMethod': 'getTitle',
                                    'setMethod': 'setTitle',
                                    'primitive': true,
                                    'array': false,
                                    'synthetic': false,
                                    'path': 'Title',
                                },
                                'fieldActions': null,
                            },
                        },
                    ],
                },
                'name': 'UI.867332',
                'sourceUri': 'atlas:java?className=twitter4j.Status',
                'targetUri': 'atlas:java?className=org.apache.camel.salesforce.dto.Contact',
                'lookupTables': { 'lookupTable': [] },
            },
        };
        return json;
    }
}
InitializationService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
InitializationService.ctorParameters = () => [
    { type: DocumentManagementService, },
    { type: MappingManagementService, },
    { type: ErrorHandlerService, },
];

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class DataMapperAppExampleHostComponent {
    /**
     * @param {?} initializationService
     */
    constructor(initializationService) {
        this.initializationService = initializationService;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // initialize config information before initializing services
        const /** @type {?} */ c = this.initializationService.cfg;
        //store references to our services in our config model
        //initialize base urls for our service calls
        c.initCfg.baseJavaInspectionServiceUrl = 'http://localhost:8585/v2/atlas/java/';
        c.initCfg.baseXMLInspectionServiceUrl = 'http://localhost:8585/v2/atlas/xml/';
        c.initCfg.baseJSONInspectionServiceUrl = 'http://localhost:8585/v2/atlas/json/';
        c.initCfg.baseMappingServiceUrl = 'http://localhost:8585/v2/atlas/';
        //initialize data for our class path service call
        //note that quotes, newlines, and tabs are escaped
        c.initCfg.pomPayload = InitializationService.createExamplePom();
        c.initCfg.classPathFetchTimeoutInMilliseconds = 30000;
        // if classPath is specified, maven call to resolve pom will be skipped
        c.initCfg.classPath = null;
        /*
         * The following examples demonstrate adding source/target documents to the Data Mapper's configuration.
         * Note that multiple source documents are supported, but multiple target documents are not supported.
         *
         * example java source document configuration:
         *
         * var documentIsSourceDocument: boolean = true;
         * c.addJavaDocument("io.atlasmap.java.test.SourceOrder", documentIsSourceDocument);
         *
         * example xml instance document:
         *
         * c.addXMLInstanceDocument("XMLInstanceSource", DocumentManagementService.generateMockInstanceXML(), documentIsSourceDocument);
         *
         * example xml schema document:
         *
         * c.addXMLSchemaDocument("XMLSchemaSource", DocumentManagementService.generateMockSchemaXML(), documentIsSourceDocument);
         *
         * example json document:
         *
         * c.addJSONDocument("JSONTarget", DocumentManagementService.generateMockJSON(), documentIsSourceDocument);
         *
         */
        //enable debug logging options as needed
        c.initCfg.debugDocumentServiceCalls = true;
        c.initCfg.debugDocumentParsing = false;
        c.initCfg.debugMappingServiceCalls = false;
        c.initCfg.debugClassPathServiceCalls = false;
        c.initCfg.debugValidationServiceCalls = false;
        c.initCfg.debugFieldActionServiceCalls = false;
        //enable mock mappings loading, example code is shown in the InitializationService for this
        c.initCfg.addMockJSONMappings = false;
        //enable mock source/target documents as needed
        c.initCfg.addMockJavaSingleSource = false;
        c.initCfg.addMockJavaSources = true;
        c.initCfg.addMockJavaCachedSource = false;
        c.initCfg.addMockXMLInstanceSources = false;
        c.initCfg.addMockXMLSchemaSources = false;
        c.initCfg.addMockJSONSources = false;
        c.initCfg.addMockJSONInstanceSources = false;
        c.initCfg.addMockJSONSchemaSources = true;
        c.initCfg.addMockJavaTarget = false;
        c.initCfg.addMockJavaCachedTarget = false;
        c.initCfg.addMockXMLInstanceTarget = false;
        c.initCfg.addMockXMLSchemaTarget = false;
        c.initCfg.addMockJSONTarget = false;
        c.initCfg.addMockJSONInstanceTarget = false;
        c.initCfg.addMockJSONSchemaTarget = true;
        //initialize system
        this.initializationService.initialize();
        //save the mappings when the ui calls us back asking for save
        c.mappingService.saveMappingOutput$.subscribe((saveHandler) => {
            //NOTE: the mapping definition being saved is currently stored in "this.cfg.mappings" until further notice.
            //This is an example callout to save the mapping to the mock java service
            c.mappingService.saveMappingToService();
            //After you've sucessfully saved you *MUST* call this (don't call on error)
            c.mappingService.handleMappingSaveSuccess(saveHandler);
        });
    }
}
DataMapperAppExampleHostComponent.decorators = [
    { type: Component, args: [{
                selector: 'data-mapper-example-host',
                template: `
        <data-mapper #dataMapperComponent></data-mapper>
    `,
                providers: [MappingManagementService, ErrorHandlerService, DocumentManagementService],
            },] },
];
/**
 * @nocollapse
 */
DataMapperAppExampleHostComponent.ctorParameters = () => [
    { type: InitializationService, },
];
DataMapperAppExampleHostComponent.propDecorators = {
    'dataMapperComponent': [{ type: ViewChild, args: ['dataMapperComponent',] },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class DataMapperAppComponent {
    /**
     * @param {?} detector
     */
    constructor(detector) {
        this.detector = detector;
        this.loadingStatus = 'Loading.';
    }
    /**
     * @return {?}
     */
    getConfig() {
        return ConfigModel.getConfig();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.getConfig().initializationService.systemInitialized$.subscribe(() => {
            this.updateFromConfig();
        });
        this.getConfig().initializationService.initializationStatusChanged$.subscribe(() => {
            this.loadingStatus = this.getConfig().initCfg.loadingStatus;
            setTimeout(() => {
                this.detector.detectChanges();
            }, 10);
        });
    }
    /**
     * @return {?}
     */
    updateFromConfig() {
        // update the mapping line drawing after our fields have redrawn themselves
        // without this, the x/y from the field dom elements is messed up / misaligned.
        setTimeout(() => { this.lineMachine.redrawLinesForMappings(); }, 1);
    }
}
DataMapperAppComponent.decorators = [
    { type: Component, args: [{
                selector: 'data-mapper',
                moduleId: module.id,
                encapsulation: ViewEncapsulation.None,
                template: `
      <div class="DataMapperUI">
          <!-- <div class="DataMapperUIBackground"></div> -->
          <!-- <div class="DataMapperUIBackgroundCover"></div> -->
          <div [attr.class]="getConfig().initCfg.initialized ? 'dataMapperBody' : 'dataMapperBodyHidden'">
              <div class="row">
                  <data-mapper-error #errorPanel [isValidation]="false" [errorService]="getConfig().errorService"></data-mapper-error>
              </div>
              <div class="row" style="min-height:0px;"><modal-window #modalWindow [cfg]="getConfig()"></modal-window></div>
              <div class="row">
                  <dm-toolbar #toolbarComponent [cfg]="getConfig()" [lineMachine]="lineMachine" [modalWindow]="modalWindow"></dm-toolbar>
              </div>
              <div class="row" style="height:calc(100% - 32px); position:relative; padding-top:10px;">
                  <div style='height:100%; padding:0;' [attr.class]="(getConfig().showMappingTable || getConfig().showNamespaceTable) ? 'col-md-9 hidden' : 'col-md-9'">
                      <div style="float:left; width:40%; height:100%;">
                          <document-definition #docDefInput [cfg]="getConfig()" [modalWindow]="modalWindow"
                              [isSource]="true" [lineMachine]="lineMachine"></document-definition>
                      </div>
                      <div style="float:left; width:20%; height:100%; margin-left:-5px; margin-right:-5px;">
                          <line-machine #lineMachine [cfg]="getConfig()"
                              [docDefInput]="docDefInput" [docDefOutput]="docDefOutput"></line-machine>
                      </div>
                      <div style="float:left; width:40%; height:100%;">
                          <document-definition #docDefOutput [cfg]="getConfig()" [modalWindow]="modalWindow"
                              [isSource]="false" [lineMachine]="lineMachine"></document-definition>
                      </div>
                      <div class="clear"></div>
                  </div>
                  <div class="col-md-9" style='height:100%; padding:0;' *ngIf="getConfig().showMappingTable">
                      <mapping-list [cfg]="getConfig()"></mapping-list>
                  </div>
                  <div class="col-md-9" style='height:100%; padding:0;' *ngIf="getConfig().showNamespaceTable">
                      <namespace-list [cfg]="getConfig()" [modalWindow]="modalWindow"></namespace-list>
                  </div>

                  <div class="col-md-3" style="padding:0px; height:100%;">
                      <mapping-detail #mappingDetailComponent [cfg]="getConfig()" [modalWindow]="modalWindow"></mapping-detail>
                  </div>
              </div>
          </div>
          <div class="DataMapperLoadingMessage" *ngIf="!getConfig().initCfg.initialized">
              <label [attr.class]="getConfig().initCfg.initializationErrorOccurred ? 'error' : ''">{{ loadingStatus }}</label>
              <span class="spinner spinner-xs spinner-inline" *ngIf="!getConfig().initCfg.initializationErrorOccurred"></span>
          </div>
      </div>
    `,
                styles: [`
      /*
          Copyright (C) 2017 Red Hat, Inc.

          Licensed under the Apache License, Version 2.0 (the "License");
          you may not use this file except in compliance with the License.
          You may obtain a copy of the License at

                  http://www.apache.org/licenses/LICENSE-2.0

          Unless required by applicable law or agreed to in writing, software
          distributed under the License is distributed on an "AS IS" BASIS,
          WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
          See the License for the specific language governing permissions and
          limitations under the License.
      */

      /* general data mapper wide styles */
      .DataMapperUI { height:100%; width:100%; position:relative; }

      .DataMapperUI .tooltip-inner { max-width:600px; color:white; }
      .DataMapperUI .clear { clear:both; height:0px; }

      .DataMapperUI .hidden { visibility:hidden; }

      .DataMapperUI I { display:inline-block; }
      .DataMapperUI I.link:hover, .DataMapperUI I.selected { color:#5CBADF; cursor:pointer; }
      .DataMapperUI I.selectedIcon { color:#5CBADF; }
      .DataMapperUI LABEL { font-weight:normal; }
      .DataMapperUI A:hover { color:#0088ce; cursor:pointer; text-decoration:none; }
      .DataMapperUI input[disabled] { color:rgb(175,175,175); }

      .DataMapperUI .form-group { margin-left:auto; margin-right:auto; margin-bottom:10px; margin-top:10px; }
      .DataMapperUI .form-group LABEL { width:75px; }
      .DataMapperUI .form-group LABEL.disabled { color:rgb(175,175,175); }
      .DataMapperUI .form-group SELECT { width:100px; }

      .DataMapperUI .modal-body { max-height:400px; overflow:auto; overflow-x:hidden; margin-bottom:5px; }
      .DataMapperUI .row { margin:0px; }

      .DataMapperUI .card-pf { margin:0; padding-left:0; padding-right:0; height:100%;
          -webkit-animation-name:dm-fade-in; -webkit-animation-duration:0.4s;
          animation-name:dm-fade-in; animation-duration:0.4s; }
      .DataMapperUI .dm-swipe-left { -webkit-animation-name:dm-swipe-left; -webkit-animation-duration:0.4s;
          animation-name:dm-swipe-left; animation-duration:0.4s; }
      .DataMapperUI .dm-swipe-right { -webkit-animation-name:dm-swipe-right; -webkit-animation-duration:0.4s;
          animation-name:dm-swipe-right; animation-duration:0.4s; }
      .DataMapperUI .card-pf-title { font-size:20px; padding:0px 12px; }
      .DataMapperUI .card-pf-heading { margin:0; padding:0; }
      .DataMapperUI .card-pf-body { padding:0px; margin:0px; }

      .DataMapperUI .alert { margin-bottom:5px; }
      .DataMapperUI .alert .close { font-size:18px; color:#888888; }

      @-webkit-keyframes dm-fade-in { from {opacity:0} to {opacity:1} }
      @keyframes dm-fade-in { from {opacity:0} to {opacity:1} }

      @-webkit-keyframes dm-fade-out { from {opacity:1} to {opacity:0} }
      @keyframes dm-fade-out { from {opacity:1} to {opacity:0} }

      @-webkit-keyframes dm-swipe-right { from {margin-left:-100%;} to {margin-left:0%;} }
      @keyframes dm-swipe-right { from {margin-left:-100%;} to {margin-left:0%;} }

      @-webkit-keyframes dm-swipe-left { from {margin-left:0%;} to {margin-left:-100%;} }
      @keyframes dm-swipe-left { from {margin-left:0%;} to {margin-left:-100%;} }

      /* background styles */
      .DataMapperUIBackgroundCover { height:100%; width:100%; position:absolute; top:0px; left:0px;
          background-image:url('/assets/dm/images/arrow_background.png'); background-repeat:repeat; opacity:0.15; }
      .DataMapperUIBackground { height:100%; width:100%; position:absolute; top:0px; left:0px; background-color:#4E5258; }
      .DataMapperUIBackground, .DataMapperUIBackgroundCover { display:none; background-image:none; }

      /* loading screen styles */
      .dataMapperBodyHidden { visibility:hidden; position:relative; height:0px; }
      .dataMapperBody { visibility:visible; height:100%; position:relative; }
      .DataMapperLoadingMessage { position:absolute; height:100%; top:0%; left:0%; padding-top:20%; width:100%; text-align:center; }
      .DataMapperLoadingMessage .error { color:crimson; }
      .DataMapperLoadingMessage .spinner { vertical-align:text-bottom; }
      .DataMapperLoadingMessage LABEL { vertical-align:text-top; margin-right:3px; }
      .DataMapperLoadingMessage IMG { height:12px; width:12px; vertical-align:middle; }

      /* toolbar styles */
      .dm-toolbar { margin:1px 0px; padding:10px; }
      .dm-toolbar .dm-toolbar-icons I { font-size:20px; margin-left:10px; vertical-align:middle; }
      .dm-toolbar .dropdown-menu { margin-top:5px; }
      .dm-toolbar .dropdown-menu LI { background-color:transparent; width:200px; }
      .dm-toolbar .dropdown-menu LI A { color:rgb(54,54,54); }
      .dm-toolbar .dropdown-menu LI I { color:rgb(54,54,54); font-size:10px; margin-right:10px;
              vertical-align:baseline; }
      .dm-toolbar .dropdown-menu LI I.fa-check { margin-top:3px; }
      .dm-toolbar .dropdown-menu LI:hover { background-color:rgba(92, 186, 223, 0.75); }
      .dm-toolbar .dropdown-menu LI:hover A { }
      .dm-toolbar .dropdown-menu LI:hover I { }

      /* document cards */
      .docDef { position:relative; border:1px solid #CAC9C9; height:100%; background-color:white; overflow:hidden; }
      .docDef .docName { overflow:hidden; display:inline-block; width:calc(100% - 45px); margin-left:3px; float:left; }
      .docDef .docName I { margin-right:5px; vertical-align:baseline; margin-bottom:4px; }
      .docDef I.searchBoxIcon { float:right; }
      .searchBox { position:relative; }
      .searchBox INPUT { width:100%; border:1px solid #FBFBFB; border-bottom:1px solid #CAC9C9; padding:5px 10px; float:left;}
      .searchBox INPUT:placeholder-shown { font-style:italic; }
      .searchBoxCloseIcon { position:absolute; right:10px; top:10px; }
      .docDef .fieldList { height:calc(100% - 90px); }
      .docDef .fieldListSearchOpen { height:calc(100% - 122px); }
      .docDef .fieldsCount { padding:5px; font-size:10px; font-weight:bold;
          text-align:right; margin:0; width:100%; border-top:1px solid #CAC9C9; padding-right:12px;
          border-bottom:0px solid black; }
      .docDef .documentHeader { color:white; background-image:-webkit-gradient(linear, left top, left bottom, from(rgb(125,125,125)), to(rgb(54,54,54))); background-image:linear-gradient(to bottom, rgb(125,125,125), rgb(54,54,54));
          font-size:16px; padding-top:5px; margin:0px; overflow:hidden; }
      .docDef .documentHeader I.link:hover { color:rgb(54,54,54); }
      I.docCollapseIcon { width:10px; margin-left:5px; }

      .noSearchResults { width:100%; padding:10px; text-align:center; }

      .DocumentFieldDetailComponent { width:100%; margin:0px; }
      .DocumentFieldDetailComponent .fieldDetail { padding:5px 10px; border-bottom:1px solid #d1d1d1; }
      .DocumentFieldDetailComponent LABEL { padding:0; margin:0; margin-bottom:1px; vertical-align:middle; }
      .DocumentFieldDetailComponent .selectedField { background-color:#02A2D8; color:white; }
      .DocumentFieldDetailComponent .selectedField I { color:white; }
      .DocumentFieldDetailComponent .dragHover { background-color:#02A2D8; color:white; }
      .DocumentFieldDetailComponent .dragHover I { color:white; }
      .docDef .DocumentFieldDetailComponent I { text-shadow:0 1px 2px rgba(3, 3, 3, 0.24); margin-right:2px; font-size:10px; }
      .DocumentFieldDetailComponent I.partOfMappingIcon { color:#0088ce; }
      .DocumentFieldDetailComponent I.arrow { text-shadow:none; width:8px; font-size:14px; margin-bottom:2px; margin-right:3px; }
      .DocumentFieldDetailComponent I.parentFolder { color:#363636; text-shadow:none; margin-right:2px; font-size:12px; }
      .DocumentFieldDetailComponent .selectedField I.partOfMappingIcon { color:white; }
      .DocumentFieldDetailComponent I.partOfMappingIconHidden { visibility:hidden; }
      .DocumentFieldDetailComponent .disableSelection LABEL { text-decoration:line-through; color: rgb(220,220,220); }
      .DocumentFieldDetailComponent .propertyFieldIcons I { font-size:12px; vertical-align:middle; text-shadow:none; }

      .DataMapperEditComponent INPUT, .DataMapperEditComponent .form-group SELECT { width:300px; }
      .DataMapperEditComponent .form-group TEXTAREA { margin:auto; }

      .dataMapperItemList  { border:1px solid black; border:1px solid #CAC9C9; margin-right:10px; height:100%; }
      .dataMapperItemList  LABEL { float:left; margin-bottom:0px; padding-left:5px; }
      .dataMapperItemList  .items { height:calc(100% - 125px); position:relative; overflow:scroll; overflow-x:hidden;
          float:left; clear:left; width:100%; }
      .dataMapperItemList  .items.searchShown { height:calc(100% - 157px); }
      .dataMapperItemList .item { border-bottom:1px solid #d1d1d1; }
      .dataMapperItemList .item.even { background-color:rgba(201,201,201,0.10); }
      .dataMapperItemList .item.active { background-color:#39a5dc; color:white; }
      .dataMapperItemList .item.active .fieldPath I { color:white; text-shadow:0 1px 2px rgba(54,54,54,0.24); }
      .dataMapperItemList .searchBox {  }

      .dataMapperItemList .itemCount { padding:5px; font-size:10px; font-weight:bold;
          text-align:right; margin:0; width:100%; border-top:1px solid #CAC9C9; padding-right:12px;
          border-bottom:0px solid black; }
      .dataMapperItemList .itemCount { float:left; clear:left; }
      .dataMapperItemList .card-pf-title .name { overflow:hidden; display:inline-block; width:calc(100% - 45px); margin-left:3px; float:left; }
      .dataMapperItemList .card-pf-title .name I { margin-right:5px; vertical-align:baseline; }
      .dataMapperItemList .card-pf-title .name LABEL { float:none; padding-left:0px; }
      .dataMapperItemList .card-pf-title { border-bottom:1px solid #CAC9C9; margin:0; padding-top:20px; padding-bottom:20px; }
      .dataMapperItemList I.searchBoxIcon { float:right; }
      .dataMapperItemList .rows { border-top:1px solid #d1d1d1; }
      .dataMapperItemList .rows.searchShown { }
      .dataMapperItemList .searchHeaderWrapper { width:100%; float:left; clear:left; position:relative; }
      .dataMapperItemList .rowTitles { background-color:white; width:calc(100% - 0px); overflow:scroll; overflow-x:hidden; padding: 2px 6px; }
      .dataMapperItemList .rowTitles.searchShown { }
      .dataMapperItemList .rowTitles LABEL { width:calc(40% - 20px); padding:5px 5px; float:left; margin-bottom:0px; }
      .dataMapperItemList .rowTitles LABEL I { margin-right:5px; vertical-align:baseline; text-shadow: 0 1px 2px rgba(3, 3, 3, 0.24); }
      .dataMapperItemList .itemRow { padding:5px 6px;}
      .dataMapperItemList .noSearchResults { font-weight:bolder; font-size:14px; text-align:center; padding:30px; }
      .dataMapperItemList .noSearchResults LABEL { float:none; }

      .mappingList .fieldNames { float:left; width:calc(40% - 20px);  }
      .mappingList .targetFieldNames { }
      .mappingList .fieldPath {  clear:left; }
      .mappingList .fieldPath I { margin-left:5px; font-size:12px; color:#0088ce; text-shadow: 0 1px 2px rgba(3, 3, 3, 0.24); }
      .mappingList .transition { float:left; width:calc(15% - 20px); }
      .mappingList .error { float:right; font-size:14px; }
      .mappingList .rowTitles LABEL.type { width:calc(15% - 20px); }

      .namespaceList LABEL.alias { width:calc(15% - 0px); }
      .namespaceList LABEL.uri { width:calc(30% - 0px); }
      .namespaceList LABEL.locationUri { width:calc(30% - 0px); }

      /* mapping detail panel */
      .fieldMappingDetail { border-left:1px solid #d1d1d1; height:100%; background-color:#d1d1d1; border:1px solid #CAC9C9; }
      .fieldMappingDetail .fieldDetail { }
      .fieldDetailTooltip LABEL { color:white; float:left; clear:left; }
      .fieldDetailTooltip LABEL.parentObjectName { color:white; font-style:italic; }
      .fieldDetailTooltip LABEL.parentObjectName I { vertical-align:baseline; }
      .fieldMappingDetail .fieldDetail INPUT { padding:2px 4px; width:calc(100% - 5px);
          color: #4d5258; -webkit-box-shadow: inset 0 2px 2px 0 rgba(0, 0, 0, 0.08); box-shadow: inset 0 2px 2px 0 rgba(0, 0, 0, 0.08); border:solid 1px #bbbbbb; }
      .fieldMappingDetail .fieldDetail .dropdown { width:calc(100% - 71px);}
      .fieldMappingDetail .fieldDetail .dropdown-menu { padding:0px; width:100%; }
      .fieldMappingDetail .fieldDetail .dropdown-menu LI A { margin:0px; }
      .fieldMappingDetail .fieldDetail .dropdown-menu button.dropdown-item { background-color:white;
              display:block; border:0px solid black; width:100%; text-align:left; }
      .fieldMappingDetail .fieldDetail .dropdown-menu button.active { background-color:#F5F5F5; }
      .fieldDetail .parentObjectName { font-style:italic; }
      .fieldDetail .parentObjectName I { font-size:12px; vertical-align:text-bottom; margin-right:2px; }
      .fieldMappingDetail I { vertical-align:middle; }
      .fieldMappingDetail A.button I { margin-right:5px; font-size:10px; }
      .fieldMappingDetail A.button { margin:10px; margin-left:0px; border:1px solid #02A2D7; padding:5px 10px; border-radius:5px; }
      .fieldMappingDetail A.button:hover { border:1px solid #363636; }
      .fieldMappingDetail HR { margin-top:15px; margin-bottom:15px; border-top:1px solid #d1d1d1; }
      .fieldMappingDetail .sectionHeader { font-weight:bold; }
      .fieldMappingDetail .fieldMappingDetail-body { height:calc(100% - 65px); overflow:auto; }
      .fieldMappingDetail A.small-primary { padding:5px 15px; border-radius:1px; border:solid 1px #00659c;
          background-image:-webkit-gradient(linear, left top, left bottom, from(#39a5dc), to(#0088ce));
          background-image:linear-gradient(to bottom, #39a5dc, #0088ce); -webkit-box-shadow:0 2px 3px 0 rgba(3, 3, 3, 0.1); box-shadow:0 2px 3px 0 rgba(3, 3, 3, 0.1);
          text-align:center; color:#ffffff; }
      .fieldMappingDetail A.small-primary:active { background-image:-webkit-gradient(linear, left top, left bottom, from(#0088ce), to(#39a5dc)); background-image:linear-gradient(to bottom, #0088ce, #39a5dc); }
      .fieldMappingDetail .collectionSectionContainer { width:100%; overflow:hidden; overflow-y:auto; height:100%; }
      .fieldMappingDetail .collectionSection { width:200%; }
      .fieldMappingDetail .collectionSectionLeft { margin-left:-100%; }

      .fieldMappingDetail .alert>.pficon { top:8px; font-size:16px; left:8px; }
      .fieldMappingDetail .alert { margin:0; border-left-width:0px; border-right-width:0px; padding:5px; }
      .fieldMappingDetail .alert LABEL { width:calc(100% - 60px); margin-left:28px; margin-bottom:0; }
      .fieldMappingDetail .alert .close { margin-right:5px; }

      .mappingFieldAction .form-group LABEL { float:left; clear:left; width:30%; }
      .mappingFieldAction .form-group SELECT { float:left; clear:left; width:calc(100% - 3px); }
      .mappingFieldAction .form-group INPUT { float:left; width:69%; text-align:right; }
      .fieldMappingDetail .mappingFieldAction .linkContainer { padding-right:6px; padding-top:15px; padding-bottom:5px; }
      .mappingFieldAction .actionContainer { -webkit-box-shadow: 0 0 1px 1px rgba(51, 51, 51, 0.25); box-shadow: 0 0 1px 1px rgba(51, 51, 51, 0.25); width:calc(100% - 7px);
          padding:2px 10px; margin-left:1px; margin-top:15px; }

      .CollapsableCardHeader {  border-top:1px solid #d1d1d1; }
      .CollapsableCardHeader .card-pf-heading { border-bottom:0; padding-left:5px; }
      .sources .CollapsableCardHeader .card-pf-heading { border-top:0; }
      .CollapsableCardHeader .card-pf-title { font-size:16px; }
      .CollapsableCardHeader I { margin-right:0px; vertical-align:middle; width:24px; font-size:20px; }

      .mappingFieldContainer { padding:0px 14px; }
      .fieldMappingDetail .linkContainer { width:100%; text-align:right; padding-bottom:15px; }

      .MappingFieldSection { background-color:white; padding:10px; margin:0; margin-bottom:15px; -webkit-box-shadow:0 0 1px 1px rgba(51, 51, 51, 0.25); box-shadow:0 0 1px 1px rgba(51, 51, 51, 0.25); }
      .MappingFieldSection LABEL { color:#363636; }
      .MappingFieldSection .fieldDetailTooltip LABEL { color:white; }

      .TransitionSelector LABEL { width:100%; }
      .TransitionSelector .enumSection LABEL { width:calc(100% - 25px); margin-bottom:0; }
      .TransitionSelector SELECT { display:block; width:100%; }

      /* modal window */
      .DataMapperUI .modal { z-index:1000; width:100%; height:100%; overflow:auto; display:block; }

      .DataMapperUI .modal-content { position:fixed; top:50%; left:50%; -webkit-transform:translate(-50%, -50%); transform:translate(-50%, -50%);
          -webkit-animation-name:dm-animatetop; -webkit-animation-duration:0.8s;
          animation-name:dm-animatetop; animation-duration:0.8s }
      .DataMapperUI .modal-footer .btn { margin-left:10px; }
      .DataMapperUI .modal-footer { margin:0; }

      @-webkit-keyframes dm-animatetop { from {top:-300px; opacity:0}  to {top:50%; opacity:1} }
      @keyframes dm-animatetop { from {top:-300px; opacity:0} to {top:50%; opacity:1} }

      .DataMapperUI .modal-message { padding:10px 20px; }

      .MappingSelectionComponent { margin-left:20px; margin-right:20px; margin-bottom:10px; width:500px; }
      .MappingSelectionComponent .MappingSelectionOptions { overflow:auto; max-height:300px; }
      .MappingSelectionComponent .inputFields,
          .MappingSelectionComponent .outputFields { width:200px; padding:5px; padding-left:10px; vertical-align:top; }

      .MappingSelectionSection { padding:0px 8px; margin-bottom:5px; border:1px solid #F6F6F6; }
      .MappingSelectionSection .pathName, .MappingSelectionSection .pathContainer,
          .MappingSelectionSection .fieldName, .MappingSelectionSection .numberWrapper { display:inline; padding:0; margin:0; float:left; }
      .MappingSelectionSection .numberWrapper { width:30px; height:30px; text-align:center; color:#fafafa; background-color:#0088ce;
          border-radius:15px; font-size:16px; margin-right:10px; margin-left:5px; margin-top:15px; }
      .MappingSelectionSection .number { display:block; font-weight:bold; margin-top:2px; }
      .SelectedMappingSelectionSection .numberWrapper { background-color:white; color:#0088ce; }
      .MappingSelectionSection .fieldName { }
      .MappingSelectionSection .pathName { word-break:break-word; }
      .MappingSelectionSection .pathContainer { display:inline-block; width:calc(100% - 45px); }
      .MappingSelectionComponent .odd { background-color:#F6F6F6; }

      .SelectedMappingSelectionSection, .MappingSelectionComponent .SelectedMappingSelectionSection.odd { background-color:#0088ce; color:#fafafa; border-color:#0088ce; }

      .MappingSelectionSection .sourceTargetSection LABEL { display:none; }
      .MappingSelectionSection .sourceTargetSection I { font-size:16px; margin-right:5px; vertical-align:text-bottom; }
      .MappingSelectionSection .sourceTargetSection I:hover { color:inherit; }

      .MappingSelectionComponent .pathHeader .pathName, .MappingSelectionComponent .pathHeader,
          .MappingSelectionComponent .pathHeader .fieldName, { display:inline; padding:0; margin:0; float:left; }
      .MappingSelectionComponent .pathHeader .pathName { word-break:break-word; }
      .MappingSelectionComponent .pathHeader { display:inline-block; width:100%; margin-top:2px; margin-bottom:20px; }
      .MappingSelectionComponent .pathHeader .fieldName { }
      .MappingSelectionComponent .sourceTargetHeader { font-size:16px; }

      .MappingSelectionComponent .fieldPair { margin-bottom:10px; border-left:1px solid rgb(54, 54, 54); padding-left:5px; margin-top:10px; }
      .SelectedMappingSelectionSection .fieldPair { border-left-color:rgb(250,250,250); }

      .MappingSelectionComponent BUTTON.addButton I { margin-right:5px; }
      .MappingSelectionComponent .header { margin-bottom:20px; }

      /* enum lookup table creation */
      .LookupTableComponent .lookupTableRow { margin:0px 10px 10px 5px; padding:5px 0px; }
      .LookupTableComponent LABEL { width:150px; margin-right:20px; overflow:hidden; vertical-align:bottom; }
      .LookupTableComponent SELECT { width:200px; vertical-align:super; }
    `],
            },] },
];
/**
 * @nocollapse
 */
DataMapperAppComponent.ctorParameters = () => [
    { type: ChangeDetectorRef, },
];
DataMapperAppComponent.propDecorators = {
    'lineMachine': [{ type: ViewChild, args: ['lineMachine',] },],
    'errorPanel': [{ type: ViewChild, args: ['errorPanel',] },],
    'modalWindow': [{ type: ViewChild, args: ['modalWindow',] },],
    'docDefInput': [{ type: ViewChild, args: ['docDefInput',] },],
    'docDefOutput': [{ type: ViewChild, args: ['docDefOutput',] },],
    'mappingDetailComponent': [{ type: ViewChild, args: ['mappingDetailComponent',] },],
    'toolbarComponent': [{ type: ViewChild, args: ['toolbarComponent',] },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class DataMapperErrorComponent {
    constructor() {
        this.isValidation = false;
    }
    /**
     * @return {?}
     */
    getErrors() {
        return this.isValidation ? ConfigModel.getConfig().validationErrors.filter(e => e.level >= ErrorLevel.ERROR)
            : ConfigModel.getConfig().errors;
    }
    /**
     * @return {?}
     */
    getWarnings() {
        return this.isValidation ? ConfigModel.getConfig().validationErrors.filter(e => e.level === ErrorLevel.WARN) : ErrorInfo[0];
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleClick(event) {
        const /** @type {?} */ errorIdentifier = event.target.attributes.getNamedItem('errorIdentifier').value;
        this.errorService.removeError(errorIdentifier);
    }
}
DataMapperErrorComponent.decorators = [
    { type: Component, args: [{
                selector: 'data-mapper-error',
                template: `
        <div class="DataMapperErrorComponent" *ngIf="errorService && getErrors().length">
            <div class="alert alert-danger" *ngFor="let e of getErrors()">
                <a class="close" (click)="handleClick($event)">
                    <i class="fa fa-close" attr.errorIdentifier="{{e.identifier}}"></i>
                </a>
                <span class="pficon pficon-error-circle-o"></span>
                {{ e.message }}
            </div>
            <div class="alert alert-warning" *ngFor="let w of getWarnings()">
                <a class="close" (click)="handleClick($event)">
                    <i class="fa fa-close" attr.errorIdentifier="{{w.identifier}}"></i>
                </a>
                <span class="pficon pficon-warning-triangle-o"></span>
                {{ w.message }}
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
DataMapperErrorComponent.ctorParameters = () => [];
DataMapperErrorComponent.propDecorators = {
    'errorService': [{ type: Input },],
    'isValidation': [{ type: Input },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class EmptyModalBodyComponent {
}
EmptyModalBodyComponent.decorators = [
    { type: Component, args: [{
                selector: 'empty-modal-body',
                template: '',
            },] },
];
/**
 * @nocollapse
 */
EmptyModalBodyComponent.ctorParameters = () => [];
class ModalWindowComponent {
    /**
     * @param {?} componentFactoryResolver
     * @param {?} detector
     */
    constructor(componentFactoryResolver, detector) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.detector = detector;
        this.headerText = '';
        this.message = null;
        this.confirmButtonText = 'OK';
        this.visible = false;
        this.componentLoaded = false;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        //from: http://stackoverflow.com/questions/40811809/add-component-dynamically-inside-an-ngif
        this.myTarget.changes.subscribe(changes => {
            setTimeout(() => {
                if (!this.componentLoaded && this.visible && this.myTarget && (this.myTarget.toArray().length)) {
                    this.loadComponent();
                }
                setTimeout(() => {
                    this.detector.detectChanges();
                }, 10);
            }, 10);
        });
    }
    /**
     * @return {?}
     */
    loadComponent() {
        const /** @type {?} */ viewContainerRef = this.myTarget.toArray()[0];
        viewContainerRef.clear();
        const /** @type {?} */ componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.nestedComponentType);
        this.nestedComponent = viewContainerRef.createComponent(componentFactory).instance;
        if (this.nestedComponentInitializedCallback != null) {
            this.nestedComponentInitializedCallback(this);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    closeClicked(event) { this.buttonClicked(false); }
    /**
     * @return {?}
     */
    close() { this.visible = false; }
    /**
     * @return {?}
     */
    show() {
        this.visible = true;
    }
    /**
     * @return {?}
     */
    reset() {
        this.cfg.errorService.clearValidationErrors();
        this.nestedComponentInitializedCallback = null;
        this.confirmButtonText = 'OK';
        this.message = '';
        this.headerText = '';
        this.componentLoaded = false;
        this.nestedComponentType = EmptyModalBodyComponent;
        this.okButtonHandler = null;
        this.cancelButtonHandler = null;
    }
    /**
     * @param {?} okClicked
     * @return {?}
     */
    buttonClicked(okClicked) {
        if (okClicked) {
            const /** @type {?} */ anyComponent = this.nestedComponent;
            if ((anyComponent != null) && (anyComponent.isDataValid)) {
                this.cfg.errorService.clearValidationErrors();
                if (!(anyComponent.isDataValid())) {
                    return;
                }
            }
            if (this.okButtonHandler) {
                this.okButtonHandler(this);
            }
        }
        else {
            if (this.cancelButtonHandler) {
                this.cancelButtonHandler(this);
            }
        }
        this.close();
    }
}
ModalWindowComponent.decorators = [
    { type: Component, args: [{
                selector: 'modal-window',
                template: `
        <div id="modalWindow" [attr.class]="visible ? 'modal fade in' : 'modal fade dm-out'" *ngIf="visible">
            <div class="modalWindow">
                <div class="modal-content">
                    <div class="modal-header">
                        <a (click)="closeClicked($event)"><span class='close'><i class="fa fa-close"></i></span></a>
                        {{ headerText }}
                    </div>
                    <div class="modal-error">
                        <data-mapper-error [isValidation]="true" [errorService]="cfg.errorService"></data-mapper-error>
                    </div>
                    <div class="modal-body">
                        <div class="modal-message" *ngIf="message">{{ message }}</div>
                        <ng-template #dyn_target></ng-template>
                    </div>
                    <div class="modal-footer">
                        <div class="modal-buttons">
                            <button class="pull-right btn btn-primary" (click)="buttonClicked(true)">{{ confirmButtonText }}</button>
                            <button class="pull-right btn btn-cancel" (click)="buttonClicked(false)">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
ModalWindowComponent.ctorParameters = () => [
    { type: ComponentFactoryResolver, },
    { type: ChangeDetectorRef, },
];
ModalWindowComponent.propDecorators = {
    'headerText': [{ type: Input },],
    'nestedComponentType': [{ type: Input },],
    'nestedComponentInitializedCallback': [{ type: Input },],
    'okButtonHandler': [{ type: Input },],
    'cancelButtonHandler': [{ type: Input },],
    'cfg': [{ type: Input },],
    'myTarget': [{ type: ViewChildren, args: ['dyn_target', { read: ViewContainerRef },] },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class TemplateEditComponent {
    constructor() {
        this.templateText = null;
    }
    /**
     * @return {?}
     */
    isDataValid() { return true; }
}
TemplateEditComponent.decorators = [
    { type: Component, args: [{
                selector: 'template-edit',
                template: `
        <div class="DataMapperEditComponent">
            <div class="form-group">
                <textarea [(ngModel)]="templateText" rows="16" cols="100"></textarea>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
TemplateEditComponent.ctorParameters = () => [];

/*
Copyright (C) 2017 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
class ToolbarComponent {
    /**
     * @param {?} action
     * @return {?}
     */
    getCSSClass(action) {
        if ('showDetails' == action) {
            return 'fa fa-exchange link' + (this.cfg.mappings.activeMapping ? ' selected' : '');
        }
        else if ('showLines' == action) {
            return 'fa fa-share-alt link' + (this.cfg.showLinesAlways ? ' selected' : '');
        }
        else if ('advancedMode' == action) {
            let /** @type {?} */ clz = 'fa fa-cog link ';
            if (this.cfg.showLinesAlways || this.cfg.showTypes
                || !this.cfg.showMappedFields || !this.cfg.showUnmappedFields) {
                clz += 'selected';
            }
            return clz;
        }
        else if ('showMappingTable' == action) {
            return 'fa fa-table link' + (this.cfg.showMappingTable ? ' selected' : '');
        }
        else if ('showNamespaceTable' == action) {
            return 'fa fa-code link' + (this.cfg.showNamespaceTable ? ' selected' : '');
        }
        else if ('editTemplate' == action) {
            return 'fa fa-file-text-o link' + (this.cfg.mappings.templateExists() ? ' selected' : '');
        }
    }
    /**
     * @return {?}
     */
    targetSupportsTemplate() {
        const /** @type {?} */ targetDoc = this.cfg.targetDocs[0];
        return targetDoc.initCfg.type.isXML() || targetDoc.initCfg.type.isJSON();
    }
    /**
     * @param {?} action
     * @param {?} event
     * @return {?}
     */
    toolbarButtonClicked(action, event) {
        event.preventDefault();
        if ('showDetails' == action) {
            if (this.cfg.mappings.activeMapping == null) {
                this.cfg.mappingService.addNewMapping(null);
                this.cfg.mappings.activeMapping.brandNewMapping = true;
            }
            else {
                this.cfg.mappingService.deselectMapping();
            }
        }
        else if ('editTemplate' == action) {
            this.editTemplate();
        }
        else if ('showLines' == action) {
            this.cfg.showLinesAlways = !this.cfg.showLinesAlways;
            this.lineMachine.redrawLinesForMappings();
        }
        else if ('showTypes' == action) {
            this.cfg.showTypes = !this.cfg.showTypes;
        }
        else if ('showMappedFields' == action) {
            this.cfg.showMappedFields = !this.cfg.showMappedFields;
        }
        else if ('showUnmappedFields' == action) {
            this.cfg.showUnmappedFields = !this.cfg.showUnmappedFields;
        }
        else if ('addMapping' == action) {
            this.cfg.mappingService.addNewMapping(null);
        }
        else if ('showMappingTable' == action) {
            this.cfg.showMappingTable = !this.cfg.showMappingTable;
            if (this.cfg.showMappingTable) {
                this.cfg.showNamespaceTable = false;
            }
        }
        else if ('showNamespaceTable' == action) {
            this.cfg.showNamespaceTable = !this.cfg.showNamespaceTable;
            if (this.cfg.showNamespaceTable) {
                this.cfg.showMappingTable = false;
            }
        }
        setTimeout(() => {
            this.lineMachine.redrawLinesForMappings();
        }, 10);
    }
    /**
     * @return {?}
     */
    editTemplate() {
        const /** @type {?} */ self = this;
        this.modalWindow.reset();
        this.modalWindow.confirmButtonText = 'Save';
        this.modalWindow.headerText = this.cfg.mappings.templateExists() ? 'Edit Template' : 'Add Template';
        this.modalWindow.nestedComponentInitializedCallback = (mw) => {
            const /** @type {?} */ templateComponent = (mw.nestedComponent);
            templateComponent.templateText = this.cfg.mappings.templateText;
        };
        this.modalWindow.nestedComponentType = TemplateEditComponent;
        this.modalWindow.okButtonHandler = (mw) => {
            const /** @type {?} */ templateComponent = (mw.nestedComponent);
            this.cfg.mappings.templateText = templateComponent.templateText;
            self.cfg.mappingService.saveCurrentMapping();
        };
        this.modalWindow.show();
    }
}
ToolbarComponent.decorators = [
    { type: Component, args: [{
                selector: 'dm-toolbar',
                template: `
    <div class="dm-toolbar">
        <div class="dm-toolbar-icons" style="float:right;">
            <i class="fa fa-plus link" (click)="toolbarButtonClicked('addMapping', $event);"
                tooltip="Add new mapping"></i>
            <i [attr.class]="getCSSClass('editTemplate')"  *ngIf="targetSupportsTemplate()"
                (click)="toolbarButtonClicked('editTemplate', $event);"></i>
            <i [attr.class]="getCSSClass('showMappingTable')" (click)="toolbarButtonClicked('showMappingTable', $event);"
               tooltip="Show / hide mapping table"></i>
            <i *ngIf="cfg.getFirstXmlDoc(false)" [attr.class]="getCSSClass('showNamespaceTable')"
                (click)="toolbarButtonClicked('showNamespaceTable', $event);"></i>
            <i [attr.class]="getCSSClass('showDetails')" (click)="toolbarButtonClicked('showDetails', $event);"
                tooltip="Show / hide mapping details"></i>
            <div dropdown placement="bottom right" style="display:inline; position:relative;">
                <i [attr.class]="getCSSClass('advancedMode')" dropdownToggle (click)="false"
                    tooltip="Editor settings"></i>
                <!-- <a href dropdownToggle (click)="false">X</a> -->
                <ul *dropdownMenu class="dropdown-menu dropdown-menu-right" role="menu">
                    <li role="menuitem" (click)="toolbarButtonClicked('showTypes', $event);">
                        <div style="float:left">
                            <a class="dropdown-item" href="#">
                                <i class="fa fa-tag"></i>Show Types
                            </a>
                        </div>
                        <i class="fa fa-check" *ngIf="cfg.showTypes" style="float:right"></i>
                        <div class="clear"></div>
                    </li>
                    <li role="menuitem" (click)="toolbarButtonClicked('showLines', $event);">
                        <div style="float:left">
                            <a class="dropdown-item" href="#">
                                <i class="fa fa-share-alt"></i>Show Lines
                            </a>
                        </div>
                        <i class="fa fa-check" *ngIf="cfg.showLinesAlways" style="float:right"></i>
                        <div class="clear"></div>
                    </li>
                    <li role="menuitem" (click)="toolbarButtonClicked('showMappedFields', $event);">
                        <div style="float:left">
                            <a class="dropdown-item" href="#">
                                <i class="fa fa-chain"></i>Show Mapped Fields
                            </a>
                        </div>
                        <i class="fa fa-check" *ngIf="cfg.showMappedFields" style="float:right"></i>
                        <div class="clear"></div>
                    </li>
                    <li role="menuitem" (click)="toolbarButtonClicked('showUnmappedFields', $event);">
                        <div style="float:left">
                            <a class="dropdown-item" href="#">
                                <i class="fa fa-chain-broken"></i>Show Unmapped Fields
                            </a>
                        </div>
                        <i class="fa fa-check" *ngIf="cfg.showUnmappedFields" style="float:right"></i>
                        <div class="clear"></div>
                    </li>
                </ul>
            </div>
        </div>
        <div style="clear:both; height:0px;"></div>
    </div>
`,
            },] },
];
/**
 * @nocollapse
 */
ToolbarComponent.ctorParameters = () => [];
ToolbarComponent.propDecorators = {
    'cfg': [{ type: Input },],
    'lineMachine': [{ type: Input },],
    'modalWindow': [{ type: Input },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class LineModel {
    constructor() {
        this.stroke = 'url(#line-gradient-dormant)';
    }
}
class LineMachineComponent {
    /**
     * @param {?} sanitizer
     * @param {?} detector
     */
    constructor(sanitizer, detector) {
        this.sanitizer = sanitizer;
        this.detector = detector;
        this.lines = [];
        this.drawingLine = false;
        this.yOffset = 3;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.cfg.mappingService.mappingUpdated$.subscribe(() => {
            this.mappingChanged();
        });
    }
    /**
     * @param {?} sourceX
     * @param {?} sourceY
     * @param {?} targetX
     * @param {?} targetY
     * @param {?} stroke
     * @return {?}
     */
    addLineFromParams(sourceX, sourceY, targetX, targetY, stroke) {
        const /** @type {?} */ l = new LineModel();
        l.sourceX = sourceX;
        l.sourceY = sourceY;
        l.targetX = targetX;
        l.targetY = targetY;
        l.stroke = stroke;
        this.addLine(l);
    }
    /**
     * @param {?} l
     * @return {?}
     */
    addLine(l) {
        this.createLineStyle(l);
        this.lines.push(l);
    }
    /**
     * @param {?} l
     * @return {?}
     */
    setLineBeingFormed(l) {
        if (l != null) {
            this.createLineStyle(l);
        }
        this.lineBeingFormed = l;
    }
    /**
     * @return {?}
     */
    clearLines() {
        this.lines = [];
    }
    /**
     * @param {?} event
     * @return {?}
     */
    drawLine(event) {
        this.drawCurrentLine(event.offsetX.toString(), event.offsetY.toString());
    }
    /**
     * @param {?} x
     * @param {?} y
     * @return {?}
     */
    drawCurrentLine(x, y) {
        if (this.drawingLine && this.lineBeingFormed) {
            this.lineBeingFormed.targetX = x;
            this.lineBeingFormed.targetY = y;
        }
    }
    /**
     * @param {?} component
     * @param {?} event
     * @param {?} isSource
     * @return {?}
     */
    handleDocumentFieldMouseOver(component, event, isSource) {
        if (!this.drawingLine) {
            return;
        }
        if (isSource) {
            return;
        }
        const /** @type {?} */ targetY = this.docDefOutput.getFieldDetailComponentPosition(component.field).y;
        this.drawCurrentLine('100%', (targetY + this.yOffset).toString());
    }
    /**
     * @return {?}
     */
    mappingChanged() {
        const /** @type {?} */ mappingIsNew = false;
        if (!mappingIsNew) {
            this.drawingLine = false;
            this.setLineBeingFormed(null);
        }
        else {
            /*
                var mapping: MappingModel = this.cfg.mappings.activeMapping;
                var inputPaths: string[] = mapping.getMappedFieldPaths(true);
                var outputPaths: string[] = mapping.getMappedFieldPaths(false);
                var inputSelected: boolean = (inputPaths.length == 1);
                var outputSelected: boolean = (outputPaths.length == 1);
                if ((inputSelected && !outputSelected) || (!inputSelected && outputSelected) ) {
                    //console.log("active line drawing turned on");
                    var l: LineModel = new LineModel();
                    var pos: any = null;
                    if (inputSelected) {
                        var fieldPathToFind: string = inputPaths[0];
                        pos = this.docDefInput.getFieldDetailComponentPosition(fieldPathToFind);
                        l.sourceX = "0";
                    } else {
                        var fieldPathToFind: string = outputPaths[0];
                        pos = this.docDefOutput.getFieldDetailComponentPosition(fieldPathToFind);
                        l.sourceX = "100%";
                    }
                    if (pos != null) {
                        l.sourceY = (pos.y + this.yOffset).toString();
                        this.setLineBeingFormed(l);
                        this.drawingLine = true;
                    }
                }
            */
        }
        this.redrawLinesForMappings();
    }
    /**
     * @return {?}
     */
    redrawLinesForMappings() {
        if (!this.cfg.initCfg.initialized) {
            return;
        }
        if (!this.cfg.mappings.activeMapping) {
            this.setLineBeingFormed(null);
        }
        this.clearLines();
        const /** @type {?} */ mappings = this.cfg.mappings.mappings;
        const /** @type {?} */ activeMapping = this.cfg.mappings.activeMapping;
        let /** @type {?} */ foundSelectedMapping = false;
        for (const /** @type {?} */ m of mappings) {
            foundSelectedMapping = foundSelectedMapping || (m == activeMapping);
            this.drawLinesForMapping(m);
        }
        if (!foundSelectedMapping && activeMapping) {
            this.drawLinesForMapping(activeMapping);
        }
        setTimeout(() => {
            this.detector.detectChanges();
        }, 10);
    }
    /**
     * @param {?} l
     * @return {?}
     */
    createLineStyle(l) {
        //angular2 will throw an error if we don't use this sanitizer to signal to angular2 that the css style value is ok.
        l.style = this.sanitizer.bypassSecurityTrustStyle('stroke:' + l.stroke + '; stroke-width:4px;');
    }
    /**
     * @param {?} m
     * @return {?}
     */
    drawLinesForMapping(m) {
        const /** @type {?} */ el = this.lineMachineElement.nativeElement;
        const /** @type {?} */ lineMachineHeight = el.offsetHeight;
        const /** @type {?} */ isSelectedMapping = (this.cfg.mappings.activeMapping == m);
        const /** @type {?} */ stroke = 'url(#line-gradient-' + (isSelectedMapping ? 'active' : 'dormant') + ')';
        for (const /** @type {?} */ fieldPair of m.fieldMappings) {
            if (!fieldPair.sourceFields.length || !fieldPair.targetFields.length) {
                return;
            }
            for (const /** @type {?} */ mappedInputField of fieldPair.sourceFields) {
                const /** @type {?} */ inputField = mappedInputField.field;
                if (!this.checkFieldEligibiltyForLineDrawing(inputField, 'input', m)) {
                    continue;
                }
                const /** @type {?} */ inputFieldPos = this.getScreenPosForField(inputField, this.docDefInput);
                if (inputFieldPos == null) {
                    continue;
                }
                let /** @type {?} */ sourceY = inputFieldPos.y;
                sourceY = (sourceY < 55) ? 55 : sourceY;
                sourceY = (sourceY > (lineMachineHeight - 27)) ? (lineMachineHeight - 27) : sourceY;
                for (const /** @type {?} */ mappedOutputField of fieldPair.targetFields) {
                    const /** @type {?} */ outputField = mappedOutputField.field;
                    if (!this.checkFieldEligibiltyForLineDrawing(outputField, 'output', m)) {
                        continue;
                    }
                    const /** @type {?} */ outputFieldPos = this.getScreenPosForField(outputField, this.docDefOutput);
                    if (outputFieldPos == null) {
                        continue;
                    }
                    let /** @type {?} */ targetY = outputFieldPos.y;
                    targetY = (targetY < 55) ? 55 : targetY;
                    targetY = (targetY > (lineMachineHeight - 27)) ? (lineMachineHeight - 27) : targetY;
                    if (isSelectedMapping || (this.cfg.showLinesAlways)) {
                        this.addLineFromParams('0', (sourceY + this.yOffset).toString(), '100%', (targetY + this.yOffset).toString(), stroke);
                    }
                }
            }
        }
    }
    /**
     * @param {?} field
     * @param {?} docDefComponent
     * @return {?}
     */
    getScreenPosForField(field, docDefComponent) {
        if (field == null || field.docDef == null) {
            return null;
        }
        if (!field.docDef.showFields) {
            const /** @type {?} */ pos = docDefComponent.getDocDefElementPosition(field.docDef);
            if (pos) {
                pos['y'] = pos['y'] + 5;
            }
            return pos;
        }
        let /** @type {?} */ parentField = field;
        while (parentField != null) {
            const /** @type {?} */ fieldPos = docDefComponent.getFieldDetailComponentPosition(parentField);
            if (fieldPos != null) {
                return fieldPos;
            }
            parentField = parentField.parentField;
        }
        return null;
    }
    /**
     * @param {?} field
     * @param {?} description
     * @param {?} m
     * @return {?}
     */
    checkFieldEligibiltyForLineDrawing(field, description, m) {
        if (!field) {
            return false;
        }
        if (!field.visibleInCurrentDocumentSearch) {
            return false;
        }
        return true;
    }
}
LineMachineComponent.decorators = [
    { type: Component, args: [{
                selector: 'line-machine',
                template: `
        <div class="LineMachineComponent" #lineMachineElement on-mousemove="drawLine($event)" style="height:100%; margin-top:6%;">
            <svg style="width:100%; height:100%;">
                <defs>
                    <linearGradient id='line-gradient-active' gradientUnits="userSpaceOnUse">
                        <stop stop-color='#0088ce'/>
                        <stop offset='100%' stop-color='#0088ce'/> <!-- was #bee1f4 -->
                    </linearGradient>
                    <linearGradient id='line-gradient-dormant' gradientUnits="userSpaceOnUse">
                        <stop stop-color='#8b8d8f'/>
                        <stop offset='100%' stop-color='#8b8d8f'/> <!-- was #EEEEEE -->
                    </linearGradient>
                </defs>
                <svg:line *ngFor="let l of lines"
                    [attr.x1]="l.sourceX" [attr.y1]="l.sourceY"
                    [attr.x2]="l.targetX" [attr.y2]="l.targetY"
                    shape-rendering="optimizeQuality"
                    [attr.style]="l.style"></svg:line>
                <svg:line *ngIf="lineBeingFormed && lineBeingFormed.targetY"
                    [attr.x1]="lineBeingFormed.sourceX" [attr.y1]="lineBeingFormed.sourceY"
                    [attr.x2]="lineBeingFormed.targetX" [attr.y2]="lineBeingFormed.targetY"
                    shape-rendering="optimizeQuality"
                    [attr.style]="lineBeingFormed.style"></svg:line>
            </svg>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
LineMachineComponent.ctorParameters = () => [
    { type: DomSanitizer, },
    { type: ChangeDetectorRef, },
];
LineMachineComponent.propDecorators = {
    'cfg': [{ type: Input },],
    'docDefInput': [{ type: Input },],
    'docDefOutput': [{ type: Input },],
    'lineMachineElement': [{ type: ViewChild, args: ['lineMachineElement',] },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class CollapsableHeaderComponent {
    constructor() {
        this.collapsed = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleMouseClick(event) {
        this.collapsed = !this.collapsed;
    }
    /**
     * @return {?}
     */
    getCSSClass() {
        return 'arrow fa fa-angle-' + (this.collapsed ? 'right' : 'down');
    }
}
CollapsableHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'collapsable-header',
                template: `
        <div class="CollapsableCardHeader" (click)="handleMouseClick($event)">
            <h2 class="card-pf-title"><i [attr.class]="getCSSClass()"></i>{{ title }}</h2>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
CollapsableHeaderComponent.ctorParameters = () => [];
CollapsableHeaderComponent.propDecorators = {
    'title': [{ type: Input },],
    'collapsed': [{ type: Input },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class PropertyFieldEditComponent {
    constructor() {
        this.field = new Field();
        this.valueType = 'STRING';
    }
    /**
     * @param {?} field
     * @return {?}
     */
    initialize(field) {
        if (field != null) {
            this.valueType = field.type;
        }
        this.field = field == null ? new Field() : field.copy();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    valueTypeSelectionChanged(event) {
        this.valueType = event.target.selectedOptions.item(0).attributes.getNamedItem('value').value;
    }
    /**
     * @return {?}
     */
    getField() {
        this.field.displayName = this.field.name;
        this.field.path = this.field.name;
        this.field.type = this.valueType;
        this.field.userCreated = true;
        return this.field;
    }
    /**
     * @return {?}
     */
    isDataValid() {
        return DataMapperUtil.isRequiredFieldValid(this.field.name, 'Name');
    }
}
PropertyFieldEditComponent.decorators = [
    { type: Component, args: [{
                selector: 'property-field-edit',
                template: `
        <div class="DataMapperEditComponent">
            <div class="form-group">
                <label>Name:</label>
                <input name="name" type="text" [(ngModel)]="field.name"/>
            </div>
            <div class="form-group">
                <label>Value:</label>
                <input name="value" type="text" [(ngModel)]="field.value"/>
            </div>
            <div class="form-group">
                <label>Value Type</label>
                <select (change)="valueTypeSelectionChanged($event);" [ngModel]="valueType">
                    <option value="BOOLEAN">Boolean</option>
                    <option value="BYTE">Byte</option>
                    <option value="BYTE_ARRAY">ByteArray</option>
                    <option value="CHAR">Char</option>
                    <option value="COMPLEX">Complex</option>
                    <option value="DECIMAL">Decimal</option>
                    <option value="DOUBLE">Double</option>
                    <option value="FLOAT">Float</option>
                    <option value="INTEGER">Integer</option>
                    <option value="LONG">Long</option>
                    <option value="SHORT">Short</option>
                    <option value="STRING">String</option>
                    <option value="TIME">Time</option>
                    <option value="DATE">Date</option>
                    <option value="DATE_TIME">DateTime</option>
                    <option value="DATE_TZ">DateTZ</option>
                    <option value="TIME_TZ">TimeTZ</option>
                    <option value="DATE_TIME_TZ">DateTimeTZ</option>
                    <option value="UNSIGNED_BYTE">Unsigned Byte</option>
                    <option value="UNSIGNED_INTEGER">Unsigned Integer</option>
                    <option value="UNSIGNED_LONG">Unsigned Long</option>
                    <option value="UNSIGNED_SHORT">Unsigned Short</option>
                </select>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
PropertyFieldEditComponent.ctorParameters = () => [];

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class ConstantFieldEditComponent {
    constructor() {
        this.field = new Field();
        this.valueType = 'STRING';
    }
    /**
     * @param {?} field
     * @return {?}
     */
    initialize(field) {
        if (field != null) {
            this.valueType = field.type;
        }
        this.field = field == null ? new Field() : field.copy();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    valueTypeSelectionChanged(event) {
        this.valueType = event.target.selectedOptions.item(0).attributes.getNamedItem('value').value;
    }
    /**
     * @return {?}
     */
    getField() {
        this.field.displayName = this.field.value;
        this.field.name = this.field.value;
        this.field.path = this.field.value;
        this.field.type = this.valueType;
        this.field.userCreated = true;
        return this.field;
    }
    /**
     * @return {?}
     */
    isDataValid() {
        return DataMapperUtil.isRequiredFieldValid(this.field.value, 'Value');
    }
}
ConstantFieldEditComponent.decorators = [
    { type: Component, args: [{
                selector: 'constant-field-edit',
                template: `
        <div class="DataMapperEditComponent">
            <div class="form-group">
                <label>Value:</label>
                <input name="value" type="text" [(ngModel)]="field.value"/>
            </div>
            <div class="form-group">
                <label>Value Type</label>
                <select (change)="valueTypeSelectionChanged($event);" [ngModel]="valueType">
                    <option value="BOOLEAN">Boolean</option>
                    <option value="BYTE">Byte</option>
                    <option value="BYTE_ARRAY">ByteArray</option>
                    <option value="CHAR">Char</option>
                    <option value="COMPLEX">Complex</option>
                    <option value="DECIMAL">Decimal</option>
                    <option value="DOUBLE">Double</option>
                    <option value="FLOAT">Float</option>
                    <option value="INTEGER">Integer</option>
                    <option value="LONG">Long</option>
                    <option value="SHORT">Short</option>
                    <option value="STRING">String</option>
                    <option value="TIME">Time</option>
                    <option value="DATE">Date</option>
                    <option value="DATE_TIME">DateTime</option>
                    <option value="DATE_TZ">DateTZ</option>
                    <option value="TIME_TZ">TimeTZ</option>
                    <option value="DATE_TIME_TZ">DateTimeTZ</option>
                    <option value="UNSIGNED_BYTE">Unsigned Byte</option>
                    <option value="UNSIGNED_INTEGER">Unsigned Integer</option>
                    <option value="UNSIGNED_LONG">Unsigned Long</option>
                    <option value="UNSIGNED_SHORT">Unsigned Short</option>
                </select>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
ConstantFieldEditComponent.ctorParameters = () => [];

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class FieldEditComponent {
    constructor() {
        this.cfg = ConfigModel.getConfig();
        this.field = new Field();
        this.parentField = DocumentDefinition.getNoneField();
        this.parentFieldName = null;
        this.isSource = false;
        this.fieldType = 'element';
        this.valueType = 'STRING';
        this.namespaceAlias = '';
        this.editMode = false;
        this.namespaces = [];
        this.docDef = null;
        this.dataSource = Observable$1.create((observer) => {
            observer.next(this.executeSearch(observer.outerValue));
        });
    }
    /**
     * @param {?} field
     * @param {?} docDef
     * @param {?} isAdd
     * @return {?}
     */
    initialize(field, docDef, isAdd) {
        this.docDef = docDef;
        this.editMode = !isAdd;
        this.field = field == null ? new Field() : field.copy();
        this.valueType = (this.field.type == null) ? 'STRING' : this.field.type;
        this.parentField = (this.field.parentField == null) ? DocumentDefinition.getNoneField() : this.field.parentField;
        if (this.docDef.initCfg.type.isXML()) {
            this.fieldType = this.field.isAttribute ? 'attribute' : 'element';
            this.parentField = (this.field.parentField == null) ? docDef.fields[0] : this.field.parentField;
            const /** @type {?} */ unqualifiedNS = NamespaceModel.getUnqualifiedNamespace();
            this.namespaceAlias = unqualifiedNS.alias;
            if (this.field.namespaceAlias) {
                this.namespaceAlias = this.field.namespaceAlias;
            }
            if (isAdd) {
                this.namespaceAlias = this.parentField.namespaceAlias == null ? unqualifiedNS.alias : this.parentField.namespaceAlias;
            }
            this.namespaces = [unqualifiedNS].concat(this.docDef.namespaces);
            // if the field references a namespace that doesn't exist, add a fake namespace option for the
            // user to select if they desire to leave that bad namespace alias in place
            let /** @type {?} */ namespaceFound = false;
            for (const /** @type {?} */ ns of this.namespaces) {
                if (ns.alias == this.namespaceAlias) {
                    namespaceFound = true;
                    break;
                }
            }
            if (!namespaceFound) {
                const /** @type {?} */ fakeNamespace = new NamespaceModel();
                fakeNamespace.alias = this.namespaceAlias;
                this.namespaces.push(fakeNamespace);
            }
        }
        this.parentFieldName = this.parentField.name;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleOnBlur(event) {
        this.parentFieldName = this.parentField.name;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    parentSelectionChanged(event) {
        const /** @type {?} */ oldParentField = this.parentField;
        this.parentField = event.item['field'];
        this.parentField = (this.parentField == null) ? oldParentField : this.parentField;
        this.parentFieldName = this.parentField.name;
        // change namespace dropdown selecte option to match parent fields' namespace automatically
        const /** @type {?} */ unqualifiedNS = NamespaceModel.getUnqualifiedNamespace();
        this.namespaceAlias = this.parentField.namespaceAlias == null ? unqualifiedNS.alias : this.parentField.namespaceAlias;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    fieldTypeSelectionChanged(event) {
        this.fieldType = event.target.selectedOptions.item(0).attributes.getNamedItem('value').value;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    valueTypeSelectionChanged(event) {
        this.valueType = event.target.selectedOptions.item(0).attributes.getNamedItem('value').value;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    namespaceSelectionChanged(event) {
        this.namespaceAlias = event.target.selectedOptions.item(0).attributes.getNamedItem('value').value;
    }
    /**
     * @param {?} filter
     * @return {?}
     */
    executeSearch(filter$$1) {
        const /** @type {?} */ formattedFields = [];
        if (this.docDef.initCfg.type.isJSON()) {
            const /** @type {?} */ noneField = DocumentDefinition.getNoneField();
            formattedFields.push({ 'field': noneField, 'displayName': noneField.getFieldLabel(true) });
        }
        for (const /** @type {?} */ field of this.docDef.getAllFields()) {
            if (!field.isParentField()) {
                continue;
            }
            const /** @type {?} */ displayName = (field == null) ? '' : field.getFieldLabel(true);
            const /** @type {?} */ formattedField = { 'field': field, 'displayName': displayName };
            if (filter$$1 == null || filter$$1 == ''
                || formattedField['displayName'].toLowerCase().indexOf(filter$$1.toLowerCase()) != -1) {
                formattedFields.push(formattedField);
            }
            if (formattedFields.length > 9) {
                break;
            }
        }
        return formattedFields;
    }
    /**
     * @return {?}
     */
    getField() {
        this.field.displayName = this.field.name;
        this.field.parentField = this.parentField;
        this.field.type = this.valueType;
        this.field.userCreated = true;
        this.field.serviceObject.jsonType = 'io.atlasmap.json.v2.JsonField';
        if (this.docDef.initCfg.type.isXML()) {
            this.field.isAttribute = (this.fieldType == 'attribute');
            this.field.namespaceAlias = this.namespaceAlias;
            const /** @type {?} */ unqualifiedNS = NamespaceModel.getUnqualifiedNamespace();
            if (this.namespaceAlias == unqualifiedNS.alias) {
                this.field.namespaceAlias = null;
            }
            this.field.serviceObject.jsonType = 'io.atlasmap.xml.v2.XmlField';
        }
        return this.field;
    }
    /**
     * @return {?}
     */
    isDataValid() {
        return DataMapperUtil.isRequiredFieldValid(this.field.name, 'Name');
    }
}
FieldEditComponent.decorators = [
    { type: Component, args: [{
                selector: 'field-edit',
                template: `
        <!-- our template for type ahead -->
        <ng-template #typeaheadTemplate let-model="item" let-index="index">
            <h5 style="font-style:italic;" *ngIf="model['field'].docDef">{{ model['field'].docDef.name }}</h5>
            <h5>{{ model['field'].path }}</h5>
        </ng-template>

        <div class="DataMapperEditComponent">
            <div class="form-group">
                <label>Parent</label>
                <input type="text" [(ngModel)]="parentFieldName" [typeahead]="dataSource"
                    typeaheadWaitMs="200" (typeaheadOnSelect)="parentSelectionChanged($event)" (blur)="handleOnBlur($event)"
                    typeaheadOptionField="displayName" [typeaheadItemTemplate]="typeaheadTemplate" disabled="{{editMode}}">
            </div>
            <div class="form-group">
                <label>Name</label>
                <input name="value" type="text" [(ngModel)]="field.name"/>
            </div>
            <div class="form-group" *ngIf="docDef.initCfg.type.isXML()">
                <label>Namespace</label>
                <select (change)="namespaceSelectionChanged($event);" [ngModel]="namespaceAlias">
                    <option *ngFor="let ns of namespaces" value="{{ns.alias}}" [selected]="namespaceAlias == ns.alias">
                        {{ ns.getPrettyLabel() }}
                    </option>
                </select>
            </div>
            <div class="form-group" *ngIf="docDef.initCfg.type.isXML()">
                <label>Field Type</label>
                <select (change)="fieldTypeSelectionChanged($event);" [ngModel]="fieldType">
                    <option value="element">Element</option>
                    <option value="attribute">Attribute</option>
                </select>
            </div>
            <div class="form-group">
                <label>Value Type</label>
                <select (change)="valueTypeSelectionChanged($event);" [ngModel]="valueType">
                    <option value="BOOLEAN">Boolean</option>
                    <option value="BYTE">Byte</option>
                    <option value="BYTE_ARRAY">ByteArray</option>
                    <option value="CHAR">Char</option>
                    <option value="COMPLEX">Complex</option>
                    <option value="DECIMAL">Decimal</option>
                    <option value="DOUBLE">Double</option>
                    <option value="FLOAT">Float</option>
                    <option value="INTEGER">Integer</option>
                    <option value="LONG">Long</option>
                    <option value="SHORT">Short</option>
                    <option value="STRING">String</option>
                    <option value="TIME">Time</option>
                    <option value="DATE">Date</option>
                    <option value="DATE_TIME">DateTime</option>
                    <option value="DATE_TZ">DateTZ</option>
                    <option value="TIME_TZ">TimeTZ</option>
                    <option value="DATE_TIME_TZ">DateTimeTZ</option>
                    <option value="UNSIGNED_BYTE">Unsigned Byte</option>
                    <option value="UNSIGNED_INTEGER">Unsigned Integer</option>
                    <option value="UNSIGNED_LONG">Unsigned Long</option>
                    <option value="UNSIGNED_SHORT">Unsigned Short</option>
                </select>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
FieldEditComponent.ctorParameters = () => [];

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class DocumentDefinitionComponent {
    constructor() {
        this.isSource = false;
        this.searchMode = false;
        this.searchFilter = '';
        this.scrollTop = 0;
        this.searchResultsExist = false;
    }
    /**
     * @param {?} docDef
     * @return {?}
     */
    getDocDefElementPosition(docDef) {
        for (const /** @type {?} */ c of this.docElements.toArray()) {
            if (c.nativeElement.id == docDef.name) {
                const /** @type {?} */ documentElementAbsPosition = this.getElementPositionForElement(c.nativeElement, false, true);
                const /** @type {?} */ myElement = this.documentDefinitionElement.nativeElement;
                const /** @type {?} */ myAbsPosition = this.getElementPositionForElement(myElement, false, false);
                return {
                    'x': (documentElementAbsPosition.x - myAbsPosition.x),
                    'y': (documentElementAbsPosition.y - myAbsPosition.y)
                };
            }
        }
        return null;
    }
    /**
     * @param {?} field
     * @return {?}
     */
    getFieldDetailComponent(field) {
        for (const /** @type {?} */ c of this.fieldComponents.toArray()) {
            const /** @type {?} */ returnedComponent = c.getFieldDetailComponent(field);
            if (returnedComponent != null) {
                return returnedComponent;
            }
        }
        return null;
    }
    /**
     * @return {?}
     */
    getElementPosition() {
        return this.getElementPositionForElement(this.documentDefinitionElement.nativeElement, true, false);
    }
    /**
     * @param {?} el
     * @param {?} addScrollTop
     * @param {?} subtractScrollTop
     * @return {?}
     */
    getElementPositionForElement(el, addScrollTop, subtractScrollTop) {
        let /** @type {?} */ x = 0;
        let /** @type {?} */ y = 0;
        while (el != null) {
            x += el.offsetLeft;
            y += el.offsetTop;
            el = el.offsetParent;
        }
        if (addScrollTop) {
            y += this.scrollTop;
        }
        if (subtractScrollTop) {
            y -= this.scrollTop;
        }
        return { 'x': x, 'y': y };
    }
    /**
     * @param {?} field
     * @return {?}
     */
    getFieldDetailComponentPosition(field) {
        const /** @type {?} */ c = this.getFieldDetailComponent(field);
        if (c == null) {
            return null;
        }
        const /** @type {?} */ fieldElementAbsPosition = c.getElementPosition();
        const /** @type {?} */ myAbsPosition = this.getElementPosition();
        return { 'x': (fieldElementAbsPosition.x - myAbsPosition.x), 'y': (fieldElementAbsPosition.y - myAbsPosition.y) };
    }
    /**
     * @return {?}
     */
    getSearchIconCSSClass() {
        const /** @type {?} */ cssClass = 'fa fa-search searchBoxIcon link';
        return this.searchMode ? (cssClass + ' selectedIcon') : cssClass;
    }
    /**
     * @return {?}
     */
    getSourcesTargetsLabel() {
        if (this.isSource) {
            return 'Sources';
        }
        else {
            return (this.cfg.targetDocs.length > 1) ? 'Targets' : 'Target';
        }
    }
    /**
     * @return {?}
     */
    getFieldCount() {
        let /** @type {?} */ count = 0;
        for (const /** @type {?} */ docDef of this.cfg.getDocs(this.isSource)) {
            if (docDef && docDef.allFields) {
                count += docDef.allFields.length;
            }
        }
        return count;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleScroll(event) {
        this.scrollTop = event.target.scrollTop;
        this.lineMachine.redrawLinesForMappings();
    }
    /**
     * @return {?}
     */
    toggleSearch() {
        this.searchMode = !this.searchMode;
        this.search(this.searchMode ? this.searchFilter : '');
    }
    /**
     * @param {?} docDef
     * @param {?} event
     * @return {?}
     */
    addField(docDef, event) {
        event.stopPropagation();
        const /** @type {?} */ self = this;
        this.modalWindow.reset();
        this.modalWindow.confirmButtonText = 'Save';
        const /** @type {?} */ isProperty = docDef.initCfg.type.isProperty();
        const /** @type {?} */ isConstant = docDef.initCfg.type.isConstant();
        this.modalWindow.headerText = isProperty ? 'Create Property' : (isConstant ? 'Create Constant' : 'Create Field');
        this.modalWindow.nestedComponentInitializedCallback = (mw) => {
            if (isProperty) {
                const /** @type {?} */ propertyComponent = (mw.nestedComponent);
                propertyComponent.initialize(null);
            }
            else if (isConstant) {
                const /** @type {?} */ constantComponent = (mw.nestedComponent);
                constantComponent.initialize(null);
            }
            else {
                const /** @type {?} */ fieldComponent = (mw.nestedComponent);
                fieldComponent.isSource = this.isSource;
                fieldComponent.initialize(null, docDef, true);
            }
        };
        this.modalWindow.nestedComponentType = isProperty ? PropertyFieldEditComponent
            : (isConstant ? ConstantFieldEditComponent : FieldEditComponent);
        this.modalWindow.okButtonHandler = (mw) => {
            if (isProperty) {
                const /** @type {?} */ propertyComponent = (mw.nestedComponent);
                docDef.addField(propertyComponent.getField());
            }
            else if (isConstant) {
                const /** @type {?} */ constantComponent = (mw.nestedComponent);
                docDef.addField(constantComponent.getField());
            }
            else {
                const /** @type {?} */ fieldComponent = (mw.nestedComponent);
                docDef.addField(fieldComponent.getField());
            }
            self.cfg.mappingService.saveCurrentMapping();
        };
        this.modalWindow.show();
    }
    /**
     * @param {?} docDef
     * @return {?}
     */
    isDocNameVisible(docDef) {
        if (this.searchMode && !docDef.visibleInCurrentDocumentSearch) {
            return false;
        }
        return true;
    }
    /**
     * @param {?} docDef
     * @return {?}
     */
    toggleFieldVisibility(docDef) {
        docDef.showFields = !docDef.showFields;
        setTimeout(() => {
            this.lineMachine.redrawLinesForMappings();
        }, 10);
    }
    /**
     * @param {?} docDef
     * @return {?}
     */
    isAddFieldAvailable(docDef) {
        return docDef.initCfg.type.isPropertyOrConstant()
            || (!docDef.isSource && docDef.initCfg.type.isJSON())
            || (!docDef.isSource && docDef.initCfg.type.isXML());
    }
    /**
     * @param {?} searchFilter
     * @return {?}
     */
    search(searchFilter) {
        this.searchResultsExist = false;
        const /** @type {?} */ searchIsEmpty = (searchFilter == null) || ('' == searchFilter);
        const /** @type {?} */ defaultVisibility = searchIsEmpty ? true : false;
        for (const /** @type {?} */ docDef of this.cfg.getDocs(this.isSource)) {
            docDef.visibleInCurrentDocumentSearch = defaultVisibility;
            for (const /** @type {?} */ field of docDef.getAllFields()) {
                field.visibleInCurrentDocumentSearch = defaultVisibility;
            }
            if (!searchIsEmpty) {
                for (const /** @type {?} */ field of docDef.getTerminalFields()) {
                    field.visibleInCurrentDocumentSearch = field.name.toLowerCase().includes(searchFilter.toLowerCase());
                    this.searchResultsExist = this.searchResultsExist || field.visibleInCurrentDocumentSearch;
                    if (field.visibleInCurrentDocumentSearch) {
                        docDef.visibleInCurrentDocumentSearch = true;
                        let /** @type {?} */ parentField = field.parentField;
                        while (parentField != null) {
                            parentField.visibleInCurrentDocumentSearch = true;
                            parentField.collapsed = false;
                            parentField = parentField.parentField;
                        }
                    }
                }
            }
        }
    }
}
DocumentDefinitionComponent.decorators = [
    { type: Component, args: [{
                selector: 'document-definition',
                template: `
        <div #documentDefinitionElement class='docDef' *ngIf="cfg && cfg.initCfg.initialized">
            <div class="card-pf">
                <div class="card-pf-heading">
                    <h2 class="card-pf-title">
                        <div class="docName">
                            <i class="fa {{ isSource ? 'fa-hdd-o' : 'fa-download' }}"></i>
                            <label>{{ getSourcesTargetsLabel() }}</label>
                        </div>
                        <i (click)="toggleSearch()" [attr.class]="getSearchIconCSSClass()"></i>
                        <div class="clear"></div>
                    </h2>

                </div>
                <div *ngIf="searchMode" class="searchBox">
                    <input type="text" #searchFilterBox
                        id="search-filter-box" (keyup)="search(searchFilterBox.value)" placeholder="Search"
                        [(ngModel)]="searchFilter" />
                    <i class="fa fa-close searchBoxCloseIcon link" (click)="toggleSearch()"></i>
                    <div class="clear"></div>
                </div>
                <div [attr.class]="searchMode ? 'fieldListSearchOpen' : 'fieldList'" style="overflow:auto;"
                    (scroll)="handleScroll($event)">
                    <div *ngFor="let docDef of cfg.getDocs(isSource)" #docDetail class="docIdentifier" [attr.id]='docDef.name'>
                        <div class="card-pf-title documentHeader" tooltip="{{ docDef.fullyQualifiedName }}" placement="bottom"
                            *ngIf="isDocNameVisible(docDef)" (click)="toggleFieldVisibility(docDef)">
                            <div style="float:left">
                                <i class="fa fa-angle-right docCollapseIcon" *ngIf="!docDef.showFields"></i>
                                <i class="fa fa-angle-down docCollapseIcon" *ngIf="docDef.showFields"></i>
                                <i class="fa {{ isSource ? 'fa-hdd-o' : 'fa-download' }}"></i>
                                <label>{{ docDef.getName(cfg.showTypes) }}</label>
                            </div>
                            <div style="float:right;" *ngIf="isAddFieldAvailable(docDef)">
                                <i class="fa fa-plus link" (click)="addField(docDef, $event)"></i>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div *ngIf="docDef.showFields">
                            <document-field-detail #fieldDetail *ngFor="let f of docDef.fields" [modalWindow]="modalWindow"
                                [field]="f" [cfg]="cfg" [lineMachine]="lineMachine"></document-field-detail>
                            <div class="FieldDetail"
                                *ngIf="!searchMode && docDef.initCfg.type.isPropertyOrConstant() && !docDef.fields.length">
                                <label style="width:100%; padding:5px 16px; margin:0">
                                    No {{ docDef.initCfg.type.isProperty() ? 'properties' : 'constants' }} exist.
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="noSearchResults" *ngIf="searchMode && !searchResultsExist">
                        <label>No search results.</label>
                    </div>
                </div>
                <div class="card-pf-heading fieldsCount">{{ getFieldCount() }} fields</div>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
DocumentDefinitionComponent.ctorParameters = () => [];
DocumentDefinitionComponent.propDecorators = {
    'cfg': [{ type: Input },],
    'isSource': [{ type: Input },],
    'lineMachine': [{ type: Input },],
    'modalWindow': [{ type: Input },],
    'documentDefinitionElement': [{ type: ViewChild, args: ['documentDefinitionElement',] },],
    'fieldComponents': [{ type: ViewChildren, args: ['fieldDetail',] },],
    'docElements': [{ type: ViewChildren, args: ['docDetail',] },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class DocumentFieldDetailComponent {
    /**
     * @param {?} sanitizer
     */
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
        this.isDragDropTarget = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    startDrag(event) {
        if (!this.field.isTerminal()) {
            // ignore drag event, it's coming from a child field who's already set on the drag event
            return;
        }
        // event's data transfer store isn't available during dragenter/dragleave/dragover, so we need
        // to store this info in a global somewhere since those methods depend on knowing if the
        // dragged field is source/target
        this.cfg.currentDraggedField = this.field;
    }
    /**
     * @param {?} event
     * @param {?} entering
     * @return {?}
     */
    dragEnterLeave(event, entering) {
        if (!this.field.isTerminal() || (this.field.isSource() == this.cfg.currentDraggedField.isSource())) {
            this.isDragDropTarget = false;
            return;
        }
        this.isDragDropTarget = entering;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    allowDrop(event) {
        if (!this.field.isTerminal() || (this.field.isSource() == this.cfg.currentDraggedField.isSource())) {
            this.isDragDropTarget = false;
            return;
        }
        event.preventDefault();
        this.isDragDropTarget = true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    endDrag(event) {
        this.isDragDropTarget = false;
        if (!this.field.isTerminal() || (this.field.isSource() == this.cfg.currentDraggedField.isSource())) {
            return;
        }
        const /** @type {?} */ droppedField = this.cfg.currentDraggedField;
        if (droppedField == null) {
            return;
        }
        this.cfg.mappingService.addNewMapping(droppedField);
        this.cfg.mappingService.fieldSelected(this.field);
    }
    /**
     * @return {?}
     */
    getFieldTypeIcon() {
        if (this.field.enumeration) {
            return 'fa fa-file-text-o';
        }
        if (this.field.isCollection) {
            return 'fa fa-list-ul';
        }
        if (this.field.docDef.initCfg.type.isXML()) {
            return this.field.isAttribute ? 'fa fa-at' : 'fa fa-code';
        }
        return 'fa fa-file-o';
    }
    /**
     * @return {?}
     */
    fieldShouldBeVisible() {
        const /** @type {?} */ partOfMapping = this.field.partOfMapping;
        return partOfMapping ? this.cfg.showMappedFields : this.cfg.showUnmappedFields;
    }
    /**
     * @return {?}
     */
    getTransformationClass() {
        if (!this.field.partOfMapping || !this.field.partOfTransformation) {
            return 'partOfMappingIcon partOfMappingIconHidden';
        }
        return 'partOfMappingIcon fa fa-bolt';
    }
    /**
     * @return {?}
     */
    getMappingClass() {
        if (!this.field.partOfMapping) {
            return 'partOfMappingIcon partOfMappingIconHidden';
        }
        let /** @type {?} */ clz = 'fa fa-circle';
        if (!this.field.isTerminal() && this.field.hasUnmappedChildren) {
            clz = 'fa fa-adjust';
        }
        return 'partOfMappingIcon ' + clz;
    }
    /**
     * @return {?}
     */
    getCssClass() {
        let /** @type {?} */ cssClass = 'fieldDetail';
        if (this.field.selected) {
            cssClass += ' selectedField';
        }
        if (!this.field.isTerminal()) {
            cssClass += ' parentField';
        }
        if (!this.field.isSource()) {
            cssClass += ' outputField';
        }
        if (this.isDragDropTarget) {
            cssClass += ' dragHover';
        }
        return cssClass;
    }
    /**
     * @return {?}
     */
    getElementPosition() {
        let /** @type {?} */ x = 0;
        let /** @type {?} */ y = 0;
        let /** @type {?} */ el = this.fieldDetailElement.nativeElement;
        while (el != null) {
            x += el.offsetLeft;
            y += el.offsetTop;
            el = el.offsetParent;
        }
        return { 'x': x, 'y': y };
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleMouseOver(event) {
        if (this.field.isTerminal()) {
            this.lineMachine.handleDocumentFieldMouseOver(this, event, this.field.isSource());
        }
    }
    /**
     * @return {?}
     */
    getParentToggleClass() {
        return 'arrow fa fa-angle-' + (this.field.collapsed ? 'right' : 'down');
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleMouseClick(event) {
        this.cfg.mappingService.fieldSelected(this.field);
        setTimeout(() => {
            this.lineMachine.redrawLinesForMappings();
        }, 10);
    }
    /**
     * @param {?} field
     * @return {?}
     */
    getFieldDetailComponent(field) {
        if (this.field == field) {
            return this;
        }
        for (const /** @type {?} */ c of this.fieldComponents.toArray()) {
            const /** @type {?} */ returnedComponent = c.getFieldDetailComponent(field);
            if (returnedComponent != null) {
                return returnedComponent;
            }
        }
        return null;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    editField(event) {
        event.stopPropagation();
        const /** @type {?} */ self = this;
        const /** @type {?} */ oldPath = this.field.path;
        this.modalWindow.reset();
        this.modalWindow.confirmButtonText = 'Save';
        const /** @type {?} */ isProperty = this.field.isProperty();
        const /** @type {?} */ isConstant = this.field.isConstant();
        this.modalWindow.headerText = isProperty ? 'Edit Property' : (isConstant ? 'Edit Constant' : 'Edit Field');
        this.modalWindow.nestedComponentInitializedCallback = (mw) => {
            if (isProperty) {
                const /** @type {?} */ propertyComponent = (mw.nestedComponent);
                propertyComponent.initialize(self.field);
            }
            else if (isConstant) {
                const /** @type {?} */ constantComponent = (mw.nestedComponent);
                constantComponent.initialize(self.field);
            }
            else {
                const /** @type {?} */ fieldComponent = (mw.nestedComponent);
                fieldComponent.isSource = self.field.isSource();
                fieldComponent.initialize(self.field, this.field.docDef, false);
            }
        };
        this.modalWindow.nestedComponentType = isProperty ? PropertyFieldEditComponent
            : (isConstant ? ConstantFieldEditComponent : FieldEditComponent);
        this.modalWindow.okButtonHandler = (mw) => {
            let /** @type {?} */ newField = null;
            if (isProperty) {
                const /** @type {?} */ propertyComponent = (mw.nestedComponent);
                newField = propertyComponent.getField();
            }
            else if (isConstant) {
                const /** @type {?} */ constantComponent = (mw.nestedComponent);
                newField = constantComponent.getField();
            }
            else {
                const /** @type {?} */ fieldComponent = (mw.nestedComponent);
                newField = fieldComponent.getField();
            }
            self.field.copyFrom(newField);
            self.field.docDef.updateField(self.field, oldPath);
            self.cfg.mappingService.saveCurrentMapping();
        };
        this.modalWindow.show();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    removeField(event) {
        event.stopPropagation();
        const /** @type {?} */ self = this;
        this.modalWindow.reset();
        this.modalWindow.confirmButtonText = 'Remove';
        if (this.field.isPropertyOrConstant()) {
            this.modalWindow.headerText = this.field.isProperty() ? 'Remove Property?' : 'Remove Constant?';
        }
        else {
            this.modalWindow.headerText = 'Remove field?';
        }
        this.modalWindow.message = "Are you sure you want to remove '" + this.field.displayName + "'?";
        this.modalWindow.okButtonHandler = (mw) => {
            self.cfg.mappings.removeFieldFromAllMappings(self.field);
            self.field.docDef.removeField(self.field);
            self.cfg.mappingService.saveCurrentMapping();
        };
        this.modalWindow.show();
    }
    /**
     * @return {?}
     */
    getSpacerWidth() {
        const /** @type {?} */ width = (this.field.fieldDepth * 30).toString();
        return this.sanitizer.bypassSecurityTrustStyle('display:inline; margin-left:' + width + 'px');
    }
}
DocumentFieldDetailComponent.decorators = [
    { type: Component, args: [{
                selector: 'document-field-detail',
                template: `
        <div class="DocumentFieldDetailComponent" [attr.id]="field.name" #fieldDetailElement on-mouseover='handleMouseOver($event)'
            *ngIf="fieldShouldBeVisible()" [attr.draggable]="field.isTerminal()" (dragstart)="startDrag($event)" (drop)="endDrag($event)"
            (dragenter)="dragEnterLeave($event, true)" (dragleave)="dragEnterLeave($event, false)" (dragover)="allowDrop($event)">
            <div [attr.class]='getCssClass()' (click)="handleMouseClick($event)" *ngIf="field.visibleInCurrentDocumentSearch">
                <div style="float:left;">
                    <div style="display:inline-block; width:24px;" *ngIf="!field.isSource()">
                        <i [attr.class]='getMappingClass()'></i>
                        <i [attr.class]='getTransformationClass()'></i>
                    </div>
                    <div class="spacer" [attr.style]="getSpacerWidth()">&nbsp;</div>
                    <div *ngIf="!field.isTerminal()" style="display:inline-block;">
                        <i [attr.class]="getParentToggleClass()"></i>
                        <i *ngIf="!field.isCollection" class="fa fa-folder parentFolder"></i>
                        <i *ngIf="field.isCollection" class="fa fa-list-ul parentFolder"></i>
                    </div>
                    <div *ngIf="field.isTerminal()" style="display:inline-block;">
                        <i [attr.class]="getFieldTypeIcon()"></i>
                    </div>
                        <label>{{ field.getFieldLabel(false) }}</label>
                    </div>
                    <div style="float:right; width:24px; text-align:right;" *ngIf="field.isSource()">
                        <i [attr.class]='getTransformationClass()'></i>
                        <i [attr.class]='getMappingClass()'></i>
                    </div>
                    <div class="propertyFieldIcons" style="float:right; text-align:right" *ngIf="field.userCreated">
                        <i class="fa fa-edit link" aria-hidden="true" (click)="editField($event);"></i>
                        <i class="fa fa-trash link" aria-hidden="true" (click)="removeField($event);"></i>
                    </div>
                    <div class="clear"></div>
            </div>
            <div class="childrenFields" *ngIf="!field.isTerminal() && !field.collapsed">
                <document-field-detail #fieldDetail *ngFor="let f of field.children"
                    [field]="f" [lineMachine]="lineMachine" [modalWindow]="modalWindow"
                    [cfg]="cfg"></document-field-detail>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
DocumentFieldDetailComponent.ctorParameters = () => [
    { type: DomSanitizer, },
];
DocumentFieldDetailComponent.propDecorators = {
    'cfg': [{ type: Input },],
    'field': [{ type: Input },],
    'lineMachine': [{ type: Input },],
    'modalWindow': [{ type: Input },],
    'fieldDetailElement': [{ type: ViewChild, args: ['fieldDetailElement',] },],
    'fieldComponents': [{ type: ViewChildren, args: ['fieldDetail',] },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class NamespaceEditComponent {
    constructor() {
        this.namespace = new NamespaceModel();
        this.targetEnabled = true;
    }
    /**
     * @param {?} namespace
     * @param {?} namespaces
     * @return {?}
     */
    initialize(namespace, namespaces) {
        this.namespace = (namespace == null) ? new NamespaceModel() : namespace.copy();
        if (!namespace.isTarget) {
            for (const /** @type {?} */ ns of namespaces) {
                if (ns.isTarget) {
                    this.targetEnabled = false;
                    break;
                }
            }
        }
    }
    /**
     * @return {?}
     */
    targetToggled() {
        this.namespace.isTarget = !this.namespace.isTarget;
        this.namespace.alias = this.namespace.isTarget ? 'tns' : '';
    }
    /**
     * @return {?}
     */
    isDataValid() {
        let /** @type {?} */ dataIsValid = DataMapperUtil.isRequiredFieldValid(this.namespace.alias, 'Alias');
        dataIsValid = DataMapperUtil.isRequiredFieldValid(this.namespace.uri, 'URI') && dataIsValid;
        return dataIsValid;
    }
}
NamespaceEditComponent.decorators = [
    { type: Component, args: [{
                selector: 'namespace-edit',
                template: `
        <div class="PropertyEditFieldComponent">
            <div class="form-group">
                <label>Alias</label>
                <input type="text" [(ngModel)]="namespace.alias" disabled="{{namespace.isTarget || !namespace.createdByUser}}">
            </div>
            <div class="form-group">
                <label>URI</label>
                <input type="text" [(ngModel)]="namespace.uri"/>
            </div>
            <div class="form-group">
                <label>Location URI</label>
                <input type="text" [(ngModel)]="namespace.locationUri"/>
            </div>
            <div class="form-group">
                <label>Type</label>
                <input type="checkbox" [ngModel]="namespace.isTarget" style="width:20px; vertical-align:middle;"
                    disabled="{{!targetEnabled}}" (click)="targetToggled()" />
                <label [attr.class]="(targetEnabled ? '' : 'disabled')" style="width:105px; ">Target Namespace</label>
                <div class="clear"></div>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
NamespaceEditComponent.ctorParameters = () => [];

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class MappingListFieldComponent {
    /**
     * @return {?}
     */
    getSourceIconCSSClass() {
        return this.isSource ? 'fa fa-hdd-o' : 'fa fa-download';
    }
    /**
     * @return {?}
     */
    getFieldPath() {
        if (this.mappedField == null || this.mappedField.field == null
            || (this.mappedField.field == DocumentDefinition.getNoneField())) {
            return '[None]';
        }
        return this.mappedField.field.getFieldLabel(true);
    }
    /**
     * @return {?}
     */
    displayParentObject() {
        if (this.mappedField == null || this.mappedField.field == null
            || this.mappedField.field.docDef == null
            || (this.mappedField.field == DocumentDefinition.getNoneField())) {
            return false;
        }
        return true;
    }
    /**
     * @return {?}
     */
    getParentObjectName() {
        if (this.mappedField == null || this.mappedField.field == null || this.mappedField.field.docDef == null) {
            return '';
        }
        return this.mappedField.field.docDef.getName(true);
    }
}
MappingListFieldComponent.decorators = [
    { type: Component, args: [{
                selector: 'mapping-list-field',
                template: `
        <ng-template #tolTemplate>
            <div class="fieldDetailTooltip" *ngIf="displayParentObject()">
                <label class="parentObjectName">
                    <i [attr.class]="isSource ? 'fa fa-hdd-o' : 'fa fa-download'"></i>
                    {{ getParentObjectName() }}
                </label>
                <label>{{ getFieldPath() }}</label>
                <label *ngIf="displayParentObject() && mappedField.field.type">({{ mappedField.field.type }})</label>
                <div class="clear"></div>
            </div>
        </ng-template>

        <label class="fieldPath" [tooltip]="tolTemplate" placement="bottom" [isDisabled]="!displayParentObject()">
            {{ getFieldPath() }}
            <i class="fa fa-bolt" *ngIf="mappedField.actions.length != 0"></i>
        </label>
    `,
            },] },
];
/**
 * @nocollapse
 */
MappingListFieldComponent.ctorParameters = () => [];
MappingListFieldComponent.propDecorators = {
    'mappedField': [{ type: Input },],
    'isSource': [{ type: Input },],
    'cfg': [{ type: Input },],
};
class MappingListComponent {
    constructor() {
        this.searchMode = false;
        this.searchFilter = '';
        this.searchResults = [];
    }
    /**
     * @return {?}
     */
    getItemsCSSClass() {
        return 'items mappings' + (this.searchMode ? ' searchShown' : '');
    }
    /**
     * @return {?}
     */
    searchResultsVisible() {
        if (!this.searchMode || this.searchFilter == null || this.searchFilter == '') {
            return false;
        }
        return (this.searchResults.length == 0);
    }
    /**
     * @param {?} mapping
     * @param {?} index
     * @return {?}
     */
    getMappingCSSClass(mapping, index) {
        let /** @type {?} */ cssClass = 'item ';
        cssClass += (index % 2 == 1) ? ' even' : '';
        if (mapping == this.cfg.mappings.activeMapping) {
            cssClass += ' active';
        }
        return cssClass;
    }
    /**
     * @param {?} mapping
     * @return {?}
     */
    selectMapping(mapping) {
        if (this.cfg.mappings.activeMapping == mapping) {
            this.cfg.mappingService.deselectMapping();
        }
        else {
            this.cfg.mappingService.selectMapping(mapping);
        }
    }
    /**
     * @return {?}
     */
    getRowTitleCSSClass() {
        return this.searchMode ? 'rowTitles searchShown' : 'rowTitles';
    }
    /**
     * @return {?}
     */
    getMappingRowsCSSClass() {
        return this.searchMode ? 'rows searchShown' : 'rows';
    }
    /**
     * @return {?}
     */
    getMappings() {
        return this.searchMode ? this.searchResults : [].concat(this.cfg.mappings.getAllMappings(true));
    }
    /**
     * @param {?} fieldPair
     * @param {?} isSource
     * @return {?}
     */
    getMappedFields(fieldPair, isSource) {
        let /** @type {?} */ fields = fieldPair.getMappedFields(isSource);
        fields = MappedField.sortMappedFieldsByPath(fields, false);
        if (fields.length == 0) {
            const /** @type {?} */ mappedField = new MappedField();
            mappedField.field = DocumentDefinition.getNoneField();
            fields.push(mappedField);
        }
        return fields;
    }
    /**
     * @return {?}
     */
    toggleSearch() {
        this.searchMode = !this.searchMode;
        this.search(this.searchFilter);
    }
    /**
     * @return {?}
     */
    getSearchIconCSSClass() {
        const /** @type {?} */ cssClass = 'fa fa-search searchBoxIcon link';
        return this.searchMode ? (cssClass + ' selectedIcon') : cssClass;
    }
    /**
     * @param {?} fieldPair
     * @return {?}
     */
    fieldPairMatchesSearch(fieldPair) {
        if (!this.searchMode || this.searchFilter == null || this.searchFilter == '') {
            return true;
        }
        const /** @type {?} */ filter$$1 = this.searchFilter.toLowerCase();
        const /** @type {?} */ transitionName = fieldPair.transition.getPrettyName();
        if (transitionName != null && transitionName.toLowerCase().includes(filter$$1)) {
            return true;
        }
        for (const /** @type {?} */ mappedField of fieldPair.getAllMappedFields()) {
            const /** @type {?} */ field = mappedField.field;
            if (field == null || field.path == null) {
                continue;
            }
            if (field.path.toLowerCase().includes(filter$$1)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} searchFilter
     * @return {?}
     */
    search(searchFilter) {
        this.searchFilter = searchFilter;
        if (!this.searchMode || this.searchFilter == null || this.searchFilter == '') {
            this.searchResults = [].concat(this.cfg.mappings.getAllMappings(true));
            return;
        }
        this.searchResults = [];
        for (const /** @type {?} */ mapping of this.cfg.mappings.getAllMappings(true)) {
            for (const /** @type {?} */ fieldPair of mapping.fieldMappings) {
                if (this.fieldPairMatchesSearch(fieldPair)) {
                    this.searchResults.push(mapping);
                    break;
                }
            }
        }
    }
}
MappingListComponent.decorators = [
    { type: Component, args: [{
                selector: 'mapping-list',
                template: `
        <div class="dataMapperItemList mappingList">
            <div class="card-pf">
                <div class="card-pf-heading">
                    <h2 class="card-pf-title">
                        <div class="name">
                        <i class="fa fa-table"></i>
                            <label>Mappings</label>
                        </div>
                        <i (click)="toggleSearch()" [attr.class]="getSearchIconCSSClass()"></i>
                        <div class="clear"></div>
                    </h2>
                    <div class="searchHeaderWrapper">
                        <div *ngIf="searchMode" class="searchBox">
                            <input type="text" #searchFilterBox id="search-filter-box" [(ngModel)]="searchFilter"
                                (keyup)="search(searchFilterBox.value)" placeholder="Search" />
                            <i class="fa fa-close searchBoxCloseIcon link" (click)="toggleSearch()"></i>
                            <div class="clear"></div>
                        </div>
                        <div [attr.class]="getRowTitleCSSClass()">
                            <label class="sources"><i class="fa fa-hdd-o"></i>Sources</label>
                            <label class="targets"><i class="fa fa-download"></i>Targets</label>
                            <label class="type"><i class="fa fa-sliders"></i>Type</label>
                            <div class="clear"></div>
                        </div>
                        <div class="clear"></div>
                    </div>
                </div>
                <div [attr.class]="getItemsCSSClass()">
                    <div [attr.class]="getMappingRowsCSSClass()">
                        <div *ngFor="let mapping of getMappings(); let index=index;"
                            [attr.class]="getMappingCSSClass(mapping, index)" (click)="selectMapping(mapping)">
                            <div *ngFor="let fieldPair of mapping.fieldMappings" class="itemRow">
                                <div class="sourceFieldNames fieldNames">
                                    <mapping-list-field *ngFor="let mappedField of getMappedFields(fieldPair, true)"
                                        [mappedField]="mappedField" [isSource]="true" [cfg]="cfg"></mapping-list-field>
                                    <div class="clear"></div>
                                </div>
                                <div class="targetFieldNames fieldNames">
                                    <mapping-list-field *ngFor="let mappedField of getMappedFields(fieldPair, false)"
                                        [mappedField]="mappedField" [isSource]="false" [cfg]="cfg"></mapping-list-field>
                                    <div class="clear"></div>
                                </div>
                                <div class="transition">
                                    <label>{{ fieldPair.transition.getPrettyName() }}</label>
                                    <div class="clear"></div>
                                </div>
                                <div class="error">
                                    <span class="pficon pficon-error-circle-o"
                                    *ngIf="mapping.validationErrors.length"></span>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                    </div>
                    <div class="noSearchResults" *ngIf="searchResultsVisible()">
                        <label>No search results.</label>
                        <div class="clear"></div>
                    </div>
                </div>
                <div class="card-pf-heading itemCount">{{ cfg.mappings.mappings.length }} mappings</div>
                <div class="clear"></div>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
MappingListComponent.ctorParameters = () => [];
MappingListComponent.propDecorators = {
    'cfg': [{ type: Input },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class NamespaceListComponent {
    constructor() {
        this.searchMode = false;
        this.searchFilter = '';
        this.selectedNamespace = null;
        this.searchResults = [];
    }
    /**
     * @param {?} namespace
     * @param {?} index
     * @return {?}
     */
    getNamespaceCSSClass(namespace, index) {
        let /** @type {?} */ cssClass = 'item itemRow ';
        cssClass += (index % 2 == 1) ? ' even' : '';
        if (namespace == this.selectedNamespace) {
            cssClass += ' active';
        }
        return cssClass;
    }
    /**
     * @return {?}
     */
    searchResultsVisible() {
        if (!this.searchMode || this.searchFilter == null || this.searchFilter == '') {
            return false;
        }
        return (this.searchResults.length == 0);
    }
    /**
     * @param {?} ns
     * @return {?}
     */
    selectNamespace(ns) {
        this.selectedNamespace = (this.selectedNamespace == ns) ? null : ns;
    }
    /**
     * @return {?}
     */
    getItemsCSSClass() {
        return 'items namespaces' + (this.searchMode ? ' searchShown' : '');
    }
    /**
     * @return {?}
     */
    getRowTitleCSSClass() {
        return this.searchMode ? 'rowTitles searchShown' : 'rowTitles';
    }
    /**
     * @return {?}
     */
    getRowsCSSClass() {
        return this.searchMode ? 'rows searchShown' : 'rows';
    }
    /**
     * @return {?}
     */
    getNamespaces() {
        return this.searchMode ? this.searchResults : this.cfg.getFirstXmlDoc(false).namespaces;
    }
    /**
     * @param {?} ns
     * @param {?} event
     * @return {?}
     */
    addEditNamespace(ns, event) {
        event.stopPropagation();
        const /** @type {?} */ isEditMode = (ns != null);
        if (!isEditMode) {
            ns = new NamespaceModel();
            ns.createdByUser = true;
        }
        this.modalWindow.reset();
        this.modalWindow.confirmButtonText = 'Save';
        this.modalWindow.headerText = (ns == null) ? 'Add Namespace' : 'Edit Namespace';
        this.modalWindow.nestedComponentInitializedCallback = (mw) => {
            const /** @type {?} */ namespaceComponent = (mw.nestedComponent);
            namespaceComponent.initialize(ns, this.cfg.getFirstXmlDoc(false).namespaces);
        };
        this.modalWindow.nestedComponentType = NamespaceEditComponent;
        this.modalWindow.okButtonHandler = (mw) => {
            const /** @type {?} */ namespaceComponent = (mw.nestedComponent);
            const /** @type {?} */ newNamespace = namespaceComponent.namespace;
            if (isEditMode) {
                ns.copyFrom(newNamespace);
            }
            else {
                this.cfg.getFirstXmlDoc(false).namespaces.push(newNamespace);
            }
            this.search(this.searchFilter);
            this.cfg.mappingService.saveCurrentMapping();
        };
        this.modalWindow.show();
    }
    /**
     * @return {?}
     */
    toggleSearch() {
        this.searchMode = !this.searchMode;
        this.search(this.searchFilter);
    }
    /**
     * @return {?}
     */
    getSearchIconCSSClass() {
        const /** @type {?} */ cssClass = 'fa fa-search searchBoxIcon link';
        return this.searchMode ? (cssClass + ' selectedIcon') : cssClass;
    }
    /**
     * @param {?} ns
     * @return {?}
     */
    namespaceMatchesSearch(ns) {
        if (!this.searchMode || this.searchFilter == null || this.searchFilter == '') {
            return true;
        }
        const /** @type {?} */ filter$$1 = this.searchFilter.toLowerCase();
        if (ns.isTarget && ('tns'.includes(filter$$1) || 'target'.includes(filter$$1))) {
            return true;
        }
        if (ns.alias != null && ns.alias.toLowerCase().includes(filter$$1)) {
            return true;
        }
        if (ns.uri != null && ns.uri.toLowerCase().includes(filter$$1)) {
            return true;
        }
        if (ns.locationUri != null && ns.locationUri.toLowerCase().includes(filter$$1)) {
            return true;
        }
        return false;
    }
    /**
     * @param {?} ns
     * @param {?} event
     * @return {?}
     */
    removeNamespace(ns, event) {
        event.stopPropagation();
        this.modalWindow.reset();
        this.modalWindow.confirmButtonText = 'Remove';
        this.modalWindow.headerText = 'Remove Namespace?';
        this.modalWindow.message = "Are you sure you want to remove '" + ns.alias + "' ?";
        this.modalWindow.okButtonHandler = (mw) => {
            DataMapperUtil.removeItemFromArray(ns, this.cfg.getFirstXmlDoc(false).namespaces);
            this.selectedNamespace = null;
            this.search(this.searchFilter);
        };
        this.modalWindow.show();
    }
    /**
     * @param {?} searchFilter
     * @return {?}
     */
    search(searchFilter) {
        if (!this.searchMode || this.searchFilter == null || this.searchFilter == '') {
            this.searchResults = [].concat(this.cfg.getFirstXmlDoc(false).namespaces);
            return;
        }
        this.searchFilter = searchFilter;
        this.searchResults = [];
        for (const /** @type {?} */ ns of this.cfg.getFirstXmlDoc(false).namespaces) {
            if (this.namespaceMatchesSearch(ns)) {
                this.searchResults.push(ns);
            }
            else if (this.selectedNamespace != null) {
                this.selectNamespace = null;
            }
        }
    }
}
NamespaceListComponent.decorators = [
    { type: Component, args: [{
                selector: 'namespace-list',
                template: `
        <div class="dataMapperItemList namespaceList">
            <div class="card-pf">
                <div class="card-pf-heading">
                    <h2 class="card-pf-title">
                        <div class="name">
                            <i class="fa fa-table"></i>
                            <label>Namespaces for {{ cfg.getFirstXmlDoc(false).initCfg.shortIdentifier }}</label>
                        </div>
                        <i (click)="toggleSearch()" [attr.class]="getSearchIconCSSClass()"></i>
                        <i (click)="addEditNamespace(null, $event)" class="fa fa-plus link"></i>
                        <div class="clear"></div>
                    </h2>
                    <div class="searchHeaderWrapper">
                        <div *ngIf="searchMode" class="searchBox">
                            <input type="text" #searchFilterBox id="search-filter-box" [(ngModel)]="searchFilter"
                                (keyup)="search(searchFilterBox.value)" placeholder="Search" />
                            <i class="fa fa-close searchBoxCloseIcon link" (click)="toggleSearch()"></i>
                            <div class="clear"></div>
                        </div>
                        <div [attr.class]="getRowTitleCSSClass()">
                            <label class="alias">Alias</label>
                            <label class="uri">Uri</label>
                            <label class="locationUri">Location URI</label>
                            <div class="clear"></div>
                        </div>
                        <div class="clear"></div>
                    </div>
                </div>
                <div [attr.class]="getItemsCSSClass()">
                    <div [attr.class]="getRowsCSSClass()">
                        <div *ngFor="let namespace of getNamespaces(); let index=index;"
                            [attr.class]="getNamespaceCSSClass(namespace, index)" (click)="selectNamespace(namespace)">
                            <label class="alias">{{ namespace.isTarget ? 'Target (tns)' : namespace.alias }}</label>
                            <label class="uri">{{ namespace.uri }}</label>
                            <label class="locationUri">{{ namespace.locationUri }}</label>
                            <div class="actions" style="float:right">
                                <i class="fa fa-edit link" aria-hidden="true" (click)="addEditNamespace(namespace, $event);"></i>
                                <i class="fa fa-trash link" aria-hidden="true" (click)="removeNamespace(namespace, $event);"></i>
                            </div>
                            <div class="clear"></div>
                        </div>
                    </div>
                    <div class="noSearchResults" *ngIf="searchResultsVisible()">
                        <label>No search results.</label>
                        <div class="clear"></div>
                    </div>
                </div>
                <div class="card-pf-heading itemCount">{{ getNamespaces().length }} namespaces</div>
                <div class="clear"></div>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
NamespaceListComponent.ctorParameters = () => [];
NamespaceListComponent.propDecorators = {
    'cfg': [{ type: Input },],
    'modalWindow': [{ type: Input },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class MappingSelectionSectionComponent {
    constructor() {
        this.selected = false;
        this.selectedFieldIsSource = false;
        this.isOddRow = false;
    }
    /**
     * @return {?}
     */
    getClass() {
        let /** @type {?} */ cssClass = 'MappingSelectionSection';
        if (this.selected) {
            cssClass += ' SelectedMappingSelectionSection';
        }
        if (this.isOddRow) {
            cssClass += ' odd';
        }
        return cssClass;
    }
    /**
     * @param {?} isSource
     * @param {?} fieldPair
     * @return {?}
     */
    getSourceTargetLabelText(isSource, fieldPair) {
        if (isSource) {
            return (fieldPair.sourceFields.length > 0) ? 'Sources' : 'Source';
        }
        return (fieldPair.targetFields.length > 0) ? 'Targets' : 'Target';
    }
    /**
     * @param {?} path
     * @param {?} nameOnly
     * @return {?}
     */
    getFormattedOutputPath(path, nameOnly) {
        if (path == null) {
            return '';
        }
        path = path.replace('.', '/');
        const /** @type {?} */ index = path.lastIndexOf('/');
        const /** @type {?} */ fieldName = (index == -1) ? path : path.substr(path.lastIndexOf('/') + 1);
        path = (index == -1) ? '' : path.substr(0, path.lastIndexOf('/') + 1);
        return nameOnly ? fieldName : path;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleMouseClick(event) {
        this.selectedCallback(this);
    }
}
MappingSelectionSectionComponent.decorators = [
    { type: Component, args: [{
                selector: 'mapping-selection-section',
                template: `
        <div [attr.class]="getClass()" (click)="handleMouseClick($event)">
            <div class="numberWrapper"><div class="number">{{ outputNumber + 1 }}</div></div>
            <div class="pathContainer">
                <div class="fieldPair" *ngFor="let fieldPair of mapping.fieldMappings">
                    <div class="sourceTargetSection sourcePaths">
                        <label>{{ getSourceTargetLabelText(true, fieldPair) }}</label>
                        <div class="paths" *ngFor="let sourceField of fieldPair.sourceFields">
                            <div class="path">
                                <div class="pathName">
                                    <i class="fa fa-hdd-o" aria-hidden="true"></i>
                                    {{ getFormattedOutputPath(sourceField.field.path, false) }}
                                </div>
                                <div class="fieldName">{{ getFormattedOutputPath(sourceField.field.path, true) }}</div>
                                <div class="clear"></div>
                            </div>
                        </div>
                    </div>
                    <div class="sourceTargetSection targetPaths">
                        <label>{{ getSourceTargetLabelText(false, fieldPair) }}</label>
                        <div class="paths" *ngFor="let targetField of fieldPair.targetFields">
                            <div class="path">
                                <div class="pathName">
                                    <i class="fa fa-download" aria-hidden="true"></i>
                                    {{ getFormattedOutputPath(targetField.field.path, false) }}
                                </div>
                                <div class="fieldName">{{ getFormattedOutputPath(targetField.field.path, true) }}</div>
                                <div class="clear"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
MappingSelectionSectionComponent.ctorParameters = () => [];
MappingSelectionSectionComponent.propDecorators = {
    'outputNumber': [{ type: Input },],
    'mapping': [{ type: Input },],
    'selectedCallback': [{ type: Input },],
    'selected': [{ type: Input },],
    'selectedFieldIsSource': [{ type: Input },],
    'parentComponent': [{ type: Input },],
    'isOddRow': [{ type: Input },],
};
class MappingSelectionComponent {
    constructor() {
        this.selectedField = null;
        this.selectedMappingComponent = null;
    }
    /**
     * @param {?} c
     * @return {?}
     */
    selectionChanged(c) {
        const /** @type {?} */ self = (c.parentComponent);
        const /** @type {?} */ oldSelectedItem = self.getSelectedMappingComponent();
        oldSelectedItem.selected = false;
        c.selected = true;
        self.selectedMappingComponent = c;
    }
    /**
     * @param {?} path
     * @param {?} nameOnly
     * @return {?}
     */
    getFormattedOutputPath(path, nameOnly) {
        path = path.replace('.', '/');
        const /** @type {?} */ index = path.lastIndexOf('/');
        const /** @type {?} */ fieldName = (index == -1) ? path : path.substr(path.lastIndexOf('/') + 1);
        path = (index == -1) ? '' : path.substr(0, path.lastIndexOf('/') + 1);
        return nameOnly ? fieldName : path;
    }
    /**
     * @return {?}
     */
    addMapping() {
        this.cfg.mappingService.addNewMapping(this.selectedField);
        this.modalWindow.close();
    }
    /**
     * @return {?}
     */
    getSelectedMapping() {
        return this.getSelectedMappingComponent().mapping;
    }
    /**
     * @return {?}
     */
    getSelectedMappingComponent() {
        if (this.selectedMappingComponent == null) {
            for (const /** @type {?} */ c of this.sectionComponents.toArray()) {
                if (c.selected) {
                    this.selectedMappingComponent = c;
                    break;
                }
            }
        }
        return this.selectedMappingComponent;
    }
}
MappingSelectionComponent.decorators = [
    { type: Component, args: [{
                selector: 'mapping-selection',
                template: `
        <div class="MappingSelectionComponent" *ngIf="mappings">
            <div class="header">
                <div class="sourceTargetHeader">{{ selectedField.isSource() ? 'Source' : 'Target' }}</div>
                <div class="pathHeader">
                    <div class="pathName">{{ getFormattedOutputPath(selectedField.path, false) }}</div>
                    <div class="fieldName">{{ getFormattedOutputPath(selectedField.path, true) }}</div>
                    <div class="clear"></div>
                </div>
                <div class="clear"></div>
                <button class="btn btn-primary addButton" (click)="addMapping()">
                    <i class="fa fa-plus"></i>Add New Mapping
                </button>
            </div>
            <div class="MappingSelectionOptions">
                <mapping-selection-section *ngFor="let mapping of mappings; let i = index; let odd=odd; let even=even;"
                    [mapping]="mapping" [outputNumber]="i" [selected]="i == 0" [selectedCallback]="selectionChanged"
                    [selectedFieldIsSource]="selectedField.isSource()" [parentComponent]="this"
                    [isOddRow]="odd" #mappingSection>
                </mapping-selection-section>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
MappingSelectionComponent.ctorParameters = () => [];
MappingSelectionComponent.propDecorators = {
    'sectionComponents': [{ type: ViewChildren, args: ['mappingSection',] },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class SimpleMappingComponent {
    constructor() {
        this.isSource = false;
    }
    /**
     * @return {?}
     */
    isAddButtonVisible() {
        if (this.isSource && this.fieldPair.transition.isCombineMode()) {
            return true;
        }
        else if (!this.isSource && this.fieldPair.transition.isSeparateMode()) {
            return true;
        }
        return false;
    }
    /**
     * @return {?}
     */
    getTopFieldTypeLabel() {
        return this.isSource ? 'Source' : 'Target';
    }
    /**
     * @return {?}
     */
    getAddButtonLabel() {
        return this.isSource ? 'Add Source' : 'Add Target';
    }
    /**
     * @return {?}
     */
    addClicked() {
        this.fieldPair.addField(DocumentDefinition.getNoneField(), this.isSource);
        this.cfg.mappingService.updateMappedField(this.fieldPair);
    }
    /**
     * @return {?}
     */
    removePair() {
        this.cfg.mappingService.removeMappedPair(this.fieldPair);
    }
    /**
     * @param {?} mappedField
     * @return {?}
     */
    removeMappedField(mappedField) {
        this.fieldPair.removeMappedField(mappedField, this.isSource);
        if (this.fieldPair.getMappedFields(this.isSource).length == 0) {
            this.fieldPair.addField(DocumentDefinition.getNoneField(), this.isSource);
        }
        this.cfg.mappingService.updateMappedField(this.fieldPair);
    }
}
SimpleMappingComponent.decorators = [
    { type: Component, args: [{
                selector: 'simple-mapping',
                template: `
        <div class="mappingFieldContainer" *ngIf="fieldPair">
            <div *ngFor="let mappedField of fieldPair.getMappedFields(isSource)" class="MappingFieldSection">
                <!-- header label / trash icon -->
                <div style="float:left;"><label>{{ getTopFieldTypeLabel() }}</label></div>
                <div style="float:right; margin-right:5px;">
                    <i class="fa fa-trash link" aria-hidden="true"
                        (click)="removeMappedField(mappedField)"></i>
                </div>
                <div class="clear"></div>

                <mapping-field-detail [fieldPair]="fieldPair" [cfg]="cfg" [isSource]="isSource"
                    [mappedField]="mappedField"></mapping-field-detail>
                <mapping-field-action [mappedField]="mappedField" [cfg]="cfg" [isSource]="isSource"
                    [fieldPair]="fieldPair"></mapping-field-action>
            </div>
            <!-- add button -->
            <div class="linkContainer" *ngIf="isAddButtonVisible()">
                <a (click)="addClicked()" class="small-primary">{{ getAddButtonLabel() }}</a>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
SimpleMappingComponent.ctorParameters = () => [];
SimpleMappingComponent.propDecorators = {
    'cfg': [{ type: Input },],
    'isSource': [{ type: Input },],
    'fieldPair': [{ type: Input },],
};
class CollectionMappingComponent {
    constructor() {
        this.fieldPairForEditing = null;
        this.animateLeft = false;
        this.animateRight = false;
    }
    /**
     * @return {?}
     */
    getAnimationCSSClass() {
        if (this.animateLeft) {
            return 'dm-swipe-left collectionSectionLeft';
        }
        else if (this.animateRight) {
            return 'dm-swipe-right';
        }
        return '';
    }
    /**
     * @param {?} fieldPair
     * @param {?} isSource
     * @return {?}
     */
    getFields(fieldPair, isSource) {
        const /** @type {?} */ fields = fieldPair.getFields(isSource);
        return (fields.length > 0) ? fields : [DocumentDefinition.getNoneField()];
    }
    /**
     * @return {?}
     */
    addClicked() {
        this.cfg.mappingService.addMappedPair();
    }
    /**
     * @param {?} fieldPair
     * @return {?}
     */
    editPair(fieldPair) {
        this.fieldPairForEditing = fieldPair;
        this.cfg.mappings.activeMapping.currentFieldMapping = fieldPair;
        this.animateLeft = true;
    }
    /**
     * @return {?}
     */
    exitEditMode() {
        this.fieldPairForEditing = null;
        this.animateLeft = false;
        this.animateRight = true;
        this.cfg.mappings.activeMapping.currentFieldMapping = null;
    }
    /**
     * @param {?} fieldPair
     * @return {?}
     */
    removePair(fieldPair) {
        this.cfg.mappingService.removeMappedPair(fieldPair);
    }
}
CollectionMappingComponent.decorators = [
    { type: Component, args: [{
                selector: 'collection-mapping',
                template: `
        <div class="collectionSectionContainer">
            <div [attr.class]="'collectionSection ' + getAnimationCSSClass()">
                <!-- collection field pairing detail -->
                <div style="float:left; width:50%; padding-top:10px;" class="mappingFieldContainer">
                    <div *ngFor="let fieldPair of cfg.mappings.activeMapping.fieldMappings">
                        <div class="MappingFieldSection">
                            <!-- header label / trash icon -->
                            <div style="float:left;">
                                <label>Source</label>
                                <i class="fa fa-bolt" style="font-size:12px; vertical-align:baseline;"
                                    *ngIf="fieldPair.hasTransition()"></i>
                            </div>
                            <div style="float:right; margin-right:5px; text-align:right">
                                <i class="fa fa-edit link" aria-hidden="true"
                                    (click)="editPair(fieldPair)"></i>
                                <i class="fa fa-trash link" aria-hidden="true" (click)="removePair(fieldPair)"></i>
                            </div>
                            <div class="clear"></div>

                            <mapping-field-detail *ngFor="let mappedField of fieldPair.getMappedFields(true)"
                                [mappedField]="mappedField" [fieldPair]="fieldPair" [cfg]="cfg" [isSource]="true"></mapping-field-detail>
                            <div style="float:left;"><label>Target</label></div>
                            <div class="clear"></div>
                            <mapping-field-detail *ngFor="let mappedField of fieldPair.getMappedFields(false)"
                                [mappedField]="mappedField" [fieldPair]="fieldPair" [cfg]="cfg" [isSource]="false"></mapping-field-detail>
                        </div>
                    </div>
                    <!-- add button -->
                    <div class="linkContainer">
                        <a (click)="addClicked()" class="small-primary">Add Mapping</a>
                    </div>
                </div>
                <div style="float:left; width:50%; margin:0; padding:0" *ngIf="fieldPairForEditing">
                    <div class="card-pf-title">
                        <div style="float:left">Edit Details</div>
                        <div style="float:right;">
                            <i class="fa fa-close link" aria-hidden="true" (click)="exitEditMode()"></i>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <mapping-pair-detail [cfg]="cfg" [fieldPair]="fieldPairForEditing"
                        [modalWindow]="modalWindow"></mapping-pair-detail>
                </div>
                <div class="clear"></div>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
CollectionMappingComponent.ctorParameters = () => [];
CollectionMappingComponent.propDecorators = {
    'cfg': [{ type: Input },],
};
class MappingPairDetailComponent {
}
MappingPairDetailComponent.decorators = [
    { type: Component, args: [{
                selector: 'mapping-pair-detail',
                template: `
        <div>
            <collapsable-header title="Sources" #sourcesHeader class="sources"></collapsable-header>
            <simple-mapping [cfg]="cfg" [isSource]="true" *ngIf="!sourcesHeader.collapsed"
                [fieldPair]="fieldPair"></simple-mapping>
            <collapsable-header title="Action" #actionsHeader></collapsable-header>
            <transition-selector [cfg]="cfg" [modalWindow]="modalWindow"
                [fieldPair]="fieldPair" *ngIf="!actionsHeader.collapsed"></transition-selector>
            <collapsable-header title="Targets" #targetsHeader></collapsable-header>
            <simple-mapping [cfg]="cfg" [isSource]="false" *ngIf="!targetsHeader.collapsed"
                [fieldPair]="fieldPair"></simple-mapping>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
MappingPairDetailComponent.ctorParameters = () => [];
MappingPairDetailComponent.propDecorators = {
    'cfg': [{ type: Input },],
    'fieldPair': [{ type: Input },],
    'modalWindow': [{ type: Input },],
    'sourcesHeader': [{ type: ViewChild, args: ['sourcesHeader',] },],
    'actionsHeader': [{ type: ViewChild, args: ['actionsHeader',] },],
    'targetsHeader': [{ type: ViewChild, args: ['targetsHeader',] },],
};
class MappingDetailComponent {
    /**
     * @return {?}
     */
    ngOnInit() {
        this.cfg.mappingService.mappingSelectionRequired$.subscribe((field) => {
            this.selectMapping(field);
        });
    }
    /**
     * @return {?}
     */
    isMappingCollection() {
        return this.cfg.mappings.activeMapping.isCollectionMode();
    }
    /**
     * @return {?}
     */
    getTitle() {
        if (this.cfg.mappings.activeMapping.isLookupMode()) {
            return 'Lookup Mapping';
        }
        return this.isMappingCollection() ? 'Repeating Mapping' : 'Mapping Details';
    }
    /**
     * @param {?} event
     * @return {?}
     */
    removeMapping(event) {
        this.modalWindow.reset();
        this.modalWindow.confirmButtonText = 'Remove';
        this.modalWindow.headerText = 'Remove Mapping?';
        this.modalWindow.message = 'Are you sure you want to remove the current mapping?';
        this.modalWindow.okButtonHandler = (mw) => {
            this.cfg.mappingService.removeMapping(this.cfg.mappings.activeMapping);
            this.cfg.showMappingDetailTray = false;
        };
        this.modalWindow.show();
    }
    /**
     * @param {?} field
     * @return {?}
     */
    selectMapping(field) {
        const /** @type {?} */ mappingsForField = this.cfg.mappings.findMappingsForField(field);
        const /** @type {?} */ self = this;
        this.modalWindow.reset();
        this.modalWindow.confirmButtonText = 'Select';
        this.modalWindow.headerText = 'Select Mapping';
        this.modalWindow.nestedComponentInitializedCallback = (mw) => {
            const /** @type {?} */ c = (mw.nestedComponent);
            c.selectedField = field;
            c.cfg = self.cfg;
            c.mappings = mappingsForField;
            c.modalWindow = this.modalWindow;
        };
        this.modalWindow.nestedComponentType = MappingSelectionComponent;
        this.modalWindow.okButtonHandler = (mw) => {
            const /** @type {?} */ c = (mw.nestedComponent);
            const /** @type {?} */ mapping = c.getSelectedMapping();
            self.cfg.mappingService.selectMapping(mapping);
        };
        this.modalWindow.cancelButtonHandler = (mw) => {
            self.cfg.mappingService.selectMapping(null);
        };
        this.modalWindow.show();
    }
}
MappingDetailComponent.decorators = [
    { type: Component, args: [{
                selector: 'mapping-detail',
                template: `
        <div class='fieldMappingDetail' *ngIf="cfg.mappings.activeMapping && cfg.showMappingDetailTray">
            <div class="card-pf">
                <div class="card-pf-heading">
                    <h2 class="card-pf-title">
                        <div style="float:left;">{{ getTitle() }}</div>
                        <div style="float:right; text-align:right;">
                            <i class="fa fa-trash link" aria-hidden="true" (click)="removeMapping($event)"></i>
                        </div>
                        <div style="clear:both; height:0px;"></div>
                    </h2>
                </div>
                <div class="fieldMappingDetail-body">
                    <div class="alert alert-danger" *ngFor="let error of cfg.mappings.activeMapping.getValidationErrors()">
                        <a class="close" (click)="cfg.mappings.activeMapping.removeError(error.identifier)">
                            <i class="fa fa-close"></i>
                        </a>
                        <span class="pficon pficon-error-circle-o"></span>
                        <label>{{ error.message }}</label>
                    </div>
                    <div class="alert alert-warning" *ngFor="let warn of cfg.mappings.activeMapping.getValidationWarnings()">
                        <a class="close" (click)="cfg.mappings.activeMapping.removeError(warn.identifier)">
                            <i class="fa fa-close"></i>
                        </a>
                        <span class="pficon pficon-warning-triangle-o"></span>
                        <label>{{ warn.message }}</label>
                    </div>
                    <div *ngIf="!isMappingCollection()">
                        <mapping-pair-detail *ngFor="let fieldPair of cfg.mappings.activeMapping.fieldMappings"
                            [cfg]="cfg" [fieldPair]="fieldPair" [modalWindow]="modalWindow"></mapping-pair-detail>
                    </div>
                    <collection-mapping [cfg]="cfg" *ngIf="isMappingCollection()"></collection-mapping>
                </div>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
MappingDetailComponent.ctorParameters = () => [];
MappingDetailComponent.propDecorators = {
    'cfg': [{ type: Input },],
    'modalWindow': [{ type: Input },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class MappingFieldDetailComponent {
    constructor() {
        this.dataSource = Observable$1.create((observer) => {
            observer.next(this.executeSearch(observer.outerValue));
        });
    }
    /**
     * @return {?}
     */
    getFieldPath() {
        if (this.mappedField == null || this.mappedField.field == null
            || (this.mappedField.field == DocumentDefinition.getNoneField())) {
            return '[None]';
        }
        return this.mappedField.field.path;
    }
    /**
     * @return {?}
     */
    getSourceIconCSSClass() {
        return this.isSource ? 'fa fa-hdd-o' : 'fa fa-download';
    }
    /**
     * @return {?}
     */
    displayParentObject() {
        if (this.mappedField == null || this.mappedField.field == null
            || this.mappedField.field.docDef == null
            || (this.mappedField.field == DocumentDefinition.getNoneField())) {
            return false;
        }
        return true;
    }
    /**
     * @return {?}
     */
    getParentObjectName() {
        if (this.mappedField == null || this.mappedField.field == null || this.mappedField.field.docDef == null) {
            return '';
        }
        return this.mappedField.field.docDef.getName(true);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    selectionChanged(event) {
        this.mappedField.field = event.item['field'];
        this.cfg.mappingService.updateMappedField(this.fieldPair);
    }
    /**
     * @param {?} filter
     * @return {?}
     */
    executeSearch(filter$$1) {
        const /** @type {?} */ formattedFields = [];
        let /** @type {?} */ fields = [DocumentDefinition.getNoneField()];
        for (const /** @type {?} */ docDef of this.cfg.getDocs(this.isSource)) {
            fields = fields.concat(docDef.getTerminalFields());
        }
        const /** @type {?} */ activeMapping = this.cfg.mappings.activeMapping;
        for (const /** @type {?} */ field of fields) {
            const /** @type {?} */ displayName = (field == null) ? '' : field.getFieldLabel(true);
            const /** @type {?} */ formattedField = { 'field': field, 'displayName': displayName };
            if (filter$$1 == null || filter$$1 == ''
                || formattedField['displayName'].toLowerCase().indexOf(filter$$1.toLowerCase()) != -1) {
                if (!activeMapping.isFieldSelectable(field)) {
                    continue;
                }
                formattedFields.push(formattedField);
            }
            if (formattedFields.length > 9) {
                break;
            }
        }
        return formattedFields;
    }
}
MappingFieldDetailComponent.decorators = [
    { type: Component, args: [{
                selector: 'mapping-field-detail',
                template: `
        <!-- our template for type ahead -->
        <ng-template #typeaheadTemplate let-model="item" let-index="index">
            <h5 style="font-style:italic;">{{ model['field'].docDef == null ? '' : model['field'].docDef.name }}</h5>
            <h5>{{ model['field'].path }}</h5>
        </ng-template>

        <!-- our template for tooltip popover -->
        <ng-template #tolTemplate>
            <div class="fieldDetailTooltip">
                <label class="parentObjectName" *ngIf="displayParentObject()">
                    <i [attr.class]="getSourceIconCSSClass()"></i>
                    {{ getParentObjectName() }}
                </label>
                <label>{{ getFieldPath() }}</label>
                <label *ngIf="displayParentObject() && mappedField.field.type">({{ mappedField.field.type }})</label>
                <div class="clear"></div>
            </div>
        </ng-template>

        <div class='fieldDetail' style="margin-bottom:5px;" *ngIf="mappedField"
            [tooltip]="tolTemplate" placement="left">
            <label class="parentObjectName" *ngIf="displayParentObject()">
                <i [attr.class]="getSourceIconCSSClass()"></i>
                {{ getParentObjectName() }}
            </label>
            <div style="width:100%;">
                <input type="text" id="input-{{isSource?'source':'target'}}-{{mappedField.field.getFieldLabel(false)}}"
                    [ngModel]="mappedField.field.getFieldLabel(false)" [typeahead]="dataSource"
                    typeaheadWaitMs="200" (typeaheadOnSelect)="selectionChanged($event)"
                    typeaheadOptionField="displayName" [typeaheadItemTemplate]="typeaheadTemplate">
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
MappingFieldDetailComponent.ctorParameters = () => [];
MappingFieldDetailComponent.propDecorators = {
    'cfg': [{ type: Input },],
    'fieldPair': [{ type: Input },],
    'isSource': [{ type: Input },],
    'mappedField': [{ type: Input },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class MappingFieldActionComponent {
    /**
     * @return {?}
     */
    getMappedFieldActions() {
        return this.mappedField.actions;
    }
    /**
     * @param {?} fieldAction
     * @return {?}
     */
    getActionDescription(fieldAction) {
        if (fieldAction.isSeparateOrCombineMode) {
            return fieldAction.config.name;
        }
        return 'Transformation';
    }
    /**
     * @return {?}
     */
    actionsExistForField() {
        return (this.getActionConfigs().length > 0);
    }
    /**
     * @return {?}
     */
    getActionConfigs() {
        const /** @type {?} */ configs = [];
        for (const /** @type {?} */ config of TransitionModel.actionConfigs) {
            if (config.appliesToField(this.mappedField.field, this.fieldPair)) {
                configs.push(config);
            }
        }
        return configs;
    }
    /**
     * @param {?} action
     * @return {?}
     */
    removeAction(action) {
        this.mappedField.removeAction(action);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    selectionChanged(event) {
        this.cfg.mappingService.saveCurrentMapping();
    }
    /**
     * @return {?}
     */
    addTransformation() {
        const /** @type {?} */ actionConfig = this.getActionConfigs()[0];
        const /** @type {?} */ action = new FieldAction();
        actionConfig.populateFieldAction(action);
        this.getMappedFieldActions().push(action);
        this.cfg.mappingService.saveCurrentMapping();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    configSelectionChanged(event) {
        const /** @type {?} */ attributes = event.target.selectedOptions.item(0).attributes;
        const /** @type {?} */ selectedActionName = attributes.getNamedItem('value').value;
        const /** @type {?} */ selectedActionIndex = attributes.getNamedItem('actionIndex').value;
        const /** @type {?} */ action = this.getMappedFieldActions()[selectedActionIndex];
        if (action.name != selectedActionName) {
            const /** @type {?} */ fieldActionConfig = TransitionModel.getActionConfigForName(selectedActionName);
            fieldActionConfig.populateFieldAction(action);
        }
        this.cfg.mappingService.saveCurrentMapping();
    }
}
MappingFieldActionComponent.decorators = [
    { type: Component, args: [{
                selector: 'mapping-field-action',
                template: `
        <div class="mappingFieldAction">
            <div class="actionContainer" *ngFor="let action of getMappedFieldActions(); let actionIndex = index">
                <div class="form-group">
                    <label style="float:left;">{{ getActionDescription(action) }}</label>
                    <div style="float:right; margin-right:5px;" *ngIf="!action.isSeparateOrCombineMode">
                        <i class="fa fa-trash link" aria-hidden="true" (click)="removeAction(action)"></i>
                    </div>
                    <div class="clear"></div>

                    <select (change)="configSelectionChanged($event);"
                        [ngModel]="action.name" *ngIf="!action.isSeparateOrCombineMode">
                        <option *ngFor="let actionConfig of getActionConfigs()"
                            [attr.actionIndex]="actionIndex"
                            [attr.value]="actionConfig.name">{{ actionConfig.name }}</option>
                    </select>

                    <div class="clear"></div>
                </div>
                <div class="form-group argument" *ngFor="let argConfig of action.config.arguments; let i = index">
                    <label style="">{{ argConfig.name }}</label>
                    <input type="text" id="input-index-{{action.getArgumentValue(argConfig.name).value}}"
                        [(ngModel)]="action.getArgumentValue(argConfig.name).value" (change)="selectionChanged($event)"/>
                    <div class="clear"></div>
                </div>
            </div>
            <div *ngIf="actionsExistForField() && !isSource" class="linkContainer">
                <a (click)="addTransformation()" class="small-primary">Add Transformation</a>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
MappingFieldActionComponent.ctorParameters = () => [];
MappingFieldActionComponent.propDecorators = {
    'cfg': [{ type: Input },],
    'mappedField': [{ type: Input },],
    'isSource': [{ type: Input },],
    'fieldPair': [{ type: Input },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class LookupTableData {
}
class LookupTableComponent {
    /**
     * @param {?} cfg
     * @param {?} fieldPair
     * @return {?}
     */
    initialize(cfg, fieldPair) {
        this.fieldPair = fieldPair;
        const /** @type {?} */ targetField = fieldPair.getFields(false)[0];
        const /** @type {?} */ targetValues = [];
        targetValues.push('[ None ]');
        for (const /** @type {?} */ e of targetField.enumValues) {
            targetValues.push(e.name);
        }
        this.table = cfg.mappings.getTableByName(fieldPair.transition.lookupTableName);
        if (this.table == null) {
            cfg.errorService.error('Could not find enum lookup table for mapping.', fieldPair);
        }
        const /** @type {?} */ d = [];
        const /** @type {?} */ sourceField = fieldPair.getFields(true)[0];
        for (const /** @type {?} */ e of sourceField.enumValues) {
            const /** @type {?} */ tableData = new LookupTableData();
            tableData.sourceEnumValue = e.name;
            tableData.targetEnumValues = [].concat(targetValues);
            const /** @type {?} */ selected = this.table.getEntryForSource(tableData.sourceEnumValue, false);
            tableData.selectedTargetEnumValue = (selected == null) ? '[ None ]' : selected.targetValue;
            d.push(tableData);
        }
        this.data = d;
    }
    /**
     * @return {?}
     */
    saveTable() {
        this.table.entries = [];
        for (const /** @type {?} */ c of this.outputSelects.toArray()) {
            const /** @type {?} */ selectedOptions = c.nativeElement.selectedOptions;
            if (selectedOptions && selectedOptions.length) {
                const /** @type {?} */ targetValue = selectedOptions[0].label;
                if (targetValue == '[ None ]') {
                    continue;
                }
                const /** @type {?} */ e = new LookupTableEntry();
                e.sourceValue = c.nativeElement.attributes['sourceValue'].value;
                e.targetValue = targetValue;
                this.table.entries.push(e);
            }
        }
    }
}
LookupTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'lookup-table',
                template: `
        <div class="LookupTableComponent" *ngIf="data">
            <div class="lookupTableRow" *ngFor="let d of data">
                <label>{{ d.sourceEnumValue }}</label>
                <select #outputSelect [ngModel]="d.selectedTargetEnumValue" [attr.sourceValue]="d.sourceEnumValue">
                    <option *ngFor="let targetEnumValue of d.targetEnumValues" [ngValue]="targetEnumValue"
                        [attr.enumvalue]="targetEnumValue">{{ targetEnumValue }}
                    </option>
                </select>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
LookupTableComponent.ctorParameters = () => [];
LookupTableComponent.propDecorators = {
    'outputSelects': [{ type: ViewChildren, args: ['outputSelect',] },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class TransitionSelectionComponent {
    constructor() {
        this.modes = TransitionMode;
        this.delimeters = TransitionDelimiter;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    selectionChanged(event) {
        const /** @type {?} */ selectorIsMode = 'mode' == event.target.attributes.getNamedItem('selector').value;
        const /** @type {?} */ selectedValue = event.target.selectedOptions.item(0).attributes.getNamedItem('value').value;
        if (selectorIsMode) {
            this.fieldPair.transition.mode = parseInt(selectedValue, 10);
        }
        else {
            this.fieldPair.transition.delimiter = parseInt(selectedValue, 10);
        }
        this.cfg.mappingService.updateMappedField(this.fieldPair);
    }
    /**
     * @return {?}
     */
    modeIsEnum() {
        return this.fieldPair.transition.isEnumerationMode();
    }
    /**
     * @return {?}
     */
    getMappedValueCount() {
        const /** @type {?} */ tableName = this.fieldPair.transition.lookupTableName;
        if (tableName == null) {
            return 0;
        }
        const /** @type {?} */ table = this.cfg.mappings.getTableByName(tableName);
        if (!table || !table.entries) {
            return 0;
        }
        return table.entries.length;
    }
    /**
     * @return {?}
     */
    showLookupTable() {
        const /** @type {?} */ mapping = this.cfg.mappings.activeMapping;
        if (!mapping.hasMappedFields(true) || !mapping.hasMappedFields(false)) {
            this.cfg.errorService.warn('Please select source and target fields before mapping values.', null);
            return;
        }
        this.modalWindow.reset();
        this.modalWindow.confirmButtonText = 'Finish';
        this.modalWindow.headerText = 'Map Enumeration Values';
        this.modalWindow.nestedComponentInitializedCallback = (mw) => {
            const /** @type {?} */ c = (mw.nestedComponent);
            c.initialize(this.cfg, this.fieldPair);
        };
        this.modalWindow.nestedComponentType = LookupTableComponent;
        this.modalWindow.okButtonHandler = (mw) => {
            const /** @type {?} */ c = (mw.nestedComponent);
            c.saveTable();
            this.cfg.mappingService.saveCurrentMapping();
        };
        this.modalWindow.show();
    }
}
TransitionSelectionComponent.decorators = [
    { type: Component, args: [{
                selector: 'transition-selector',
                template: `
        <div class="mappingFieldContainer TransitionSelector" *ngIf="cfg.mappings.activeMapping">
            <div class="MappingFieldSection">
                <div *ngIf="modeIsEnum()" class="enumSection">
                    <label>{{ getMappedValueCount() }} values mapped</label>
                    <i class="fa fa-edit link" (click)="showLookupTable()"></i>
                </div>
                <div *ngIf="!modeIsEnum()">
                    <label>Action</label>
                    <select  id="select-action" (change)="selectionChanged($event);" selector="mode"
                        [ngModel]="fieldPair.transition.mode">
                        <option value="{{modes.COMBINE}}">Combine</option>
                        <option value="{{modes.MAP}}">Map</option>
                        <option value="{{modes.SEPARATE}}">Separate</option>
                    </select>
                    <div class="clear"></div>
                </div>
                <div *ngIf="fieldPair.transition.isSeparateMode() || fieldPair.transition.isCombineMode()" style="margin-top:10px;">
                    <label>Separator:</label>
                    <select  id="select-separator" (change)="selectionChanged($event);" selector="separator"
                        [ngModel]="fieldPair.transition.delimiter">
                        <option value="{{delimeters.COLON}}">Colon</option>
                        <option value="{{delimeters.COMMA}}">Comma</option>
                        <option value="{{delimeters.MULTISPACE}}">Multispace</option>
                        <option value="{{delimeters.SPACE}}">Space</option>
                    </select>
                </div>
            </div>
        </div>
    `,
            },] },
];
/**
 * @nocollapse
 */
TransitionSelectionComponent.ctorParameters = () => [];
TransitionSelectionComponent.propDecorators = {
    'cfg': [{ type: Input },],
    'modalWindow': [{ type: Input },],
    'fieldPair': [{ type: Input },],
};

/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
class DataMapperModule {
}
DataMapperModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    HttpModule,
                    FormsModule,
                    TypeaheadModule.forRoot(),
                    TooltipModule.forRoot(),
                    BsDropdownModule.forRoot(),
                ],
                declarations: [
                    DataMapperAppComponent,
                    DocumentDefinitionComponent,
                    MappingDetailComponent,
                    SimpleMappingComponent,
                    CollectionMappingComponent,
                    MappingPairDetailComponent,
                    ModalWindowComponent,
                    DataMapperAppExampleHostComponent,
                    MappingFieldActionComponent,
                    MappingFieldDetailComponent,
                    DocumentFieldDetailComponent,
                    DataMapperErrorComponent,
                    TransitionSelectionComponent,
                    LineMachineComponent,
                    MappingSelectionComponent,
                    MappingSelectionSectionComponent,
                    ToolbarComponent,
                    LookupTableComponent,
                    EmptyModalBodyComponent,
                    FieldEditComponent,
                    NamespaceEditComponent,
                    PropertyFieldEditComponent,
                    ConstantFieldEditComponent,
                    CollapsableHeaderComponent,
                    MappingListComponent,
                    MappingListFieldComponent,
                    NamespaceListComponent,
                    TemplateEditComponent,
                ],
                exports: [
                    DataMapperAppExampleHostComponent,
                    ModalWindowComponent,
                    DataMapperAppComponent,
                ],
                providers: [
                    DocumentManagementService,
                    MappingManagementService,
                    ErrorHandlerService,
                    InitializationService,
                ],
                entryComponents: [
                    MappingSelectionComponent,
                    LookupTableComponent,
                    EmptyModalBodyComponent,
                    FieldEditComponent,
                    NamespaceEditComponent,
                    PropertyFieldEditComponent,
                    ConstantFieldEditComponent,
                    TemplateEditComponent,
                ],
                bootstrap: [DataMapperAppExampleHostComponent],
            },] },
];
/**
 * @nocollapse
 */
DataMapperModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { ErrorHandlerService, DocumentManagementService, MappingManagementService, InitializationService, DocumentDefinition, MappingDefinition, ConfigModel, MappingModel, MappingSerializer, DataMapperAppComponent, DataMapperModule, CollapsableHeaderComponent as ɵw, ConstantFieldEditComponent as ɵv, DataMapperErrorComponent as ɵl, DataMapperAppExampleHostComponent as ɵh, DocumentDefinitionComponent as ɵa, DocumentFieldDetailComponent as ɵk, FieldEditComponent as ɵs, LineMachineComponent as ɵn, LookupTableComponent as ɵr, CollectionMappingComponent as ɵc, MappingDetailComponent as ɵe, MappingPairDetailComponent as ɵd, SimpleMappingComponent as ɵb, MappingFieldActionComponent as ɵi, MappingFieldDetailComponent as ɵj, MappingListComponent as ɵy, MappingListFieldComponent as ɵx, MappingSelectionComponent as ɵp, MappingSelectionSectionComponent as ɵo, TransitionSelectionComponent as ɵm, EmptyModalBodyComponent as ɵf, ModalWindowComponent as ɵg, NamespaceEditComponent as ɵt, NamespaceListComponent as ɵz, PropertyFieldEditComponent as ɵu, TemplateEditComponent as ɵba, ToolbarComponent as ɵq };
//# sourceMappingURL=atlasmap-data-mapper.js.map
