import { FileType, Transformer } from "../../types";
import {
  addFunction,
  addFunctionCall,
  addFunctionPrototype,
} from "../codeTemplates";

// @see https://github.com/iamcsharper/react-configurator/blob/main/src/store/timers/rtc.ts
export enum RtcSourceType {
  External = "internal",
  Internal = "external",
}

const Months = [
  "RTC_MONTH_JANUARY",
  "RTC_MONTH_FEBRUARY",
  "RTC_MONTH_MARCH",
  "RTC_MONTH_APRIL",
  "RTC_MONTH_MAY",
  "RTC_MONTH_JUNE",
  "RTC_MONTH_JULY",
  "RTC_MONTH_AUGUST",
  "RTC_MONTH_SEPTEMBER",
  "RTC_MONTH_OCTOBER",
  "RTC_MONTH_NOVEMBER",
  "RTC_MONTH_DECEMBER",
];

const WeekDays = [
  "RTC_WEEKDAY_MONDAY",
  "RTC_WEEKDAY_TUESDAY",
  "RTC_WEEKDAY_WEDNESDAY",
  "RTC_WEEKDAY_THURSDAY",
  "RTC_WEEKDAY_FRIDAY",
  "RTC_WEEKDAY_SATURDAY",
  "RTC_WEEKDAY_SUNDAY",
]

export interface RtcTimeDate {
  year: number;
  month: number;
  day: number;
  weekDay: number;

  hours: number;
  minutes: number;
  seconds: number;
}

export interface RtcState {
  rtcEnabled: boolean;
  alarmEnabled: boolean;

  rtcSource: RtcSourceType;
  rtcDateTime: RtcTimeDate;
  rtcRegisters: number[];

  // TODO: alarm date and time?
}

const GENERATED_BY = `/** Generated by rtcTransformer **/`;

export const transformRtc: Transformer = (context, { timers: { rtc } }) => {
  const mainc = context.getOrCreateFile("main.c", FileType.SOURCE);

  if (rtc.rtcEnabled) {
    mainc.includes.push("#include <rtc.h>");
    const { rtcDateTime } = rtc;

    mainc.privateVariables.push("RTC_HandleTypeDef hrtc;");

    addFunctionPrototype(mainc.privateFunctionPrototypes, "MX_RTC_Init", {
      specifier: "static",
    });

    addFunctionCall(mainc.main, "MX_RTC_Init");

    addFunction(mainc.privateFunctions, "MX_RTC_Init", [
      "RTC_TimeTypeDef sTime = {0};",
      "RTC_DateTypeDef sDate = {0};",
      "RTC_AlarmTypeDef sAlarm = {0};",
      "",
      "hrtc.Instance = RTC;",
      "",
      "/* Установка даты и времени RTC */",
      `sTime.Dow = ${WeekDays[rtcDateTime.weekDay-1]}`,
      `sTime.Hours = ${rtcDateTime.hours};`,
      `sTime.Minutes = ${rtcDateTime.minutes};`,
      `sTime.Seconds = ${rtcDateTime.seconds};`,
      "/* Выключение RTC для записи даты и времени */",
      "HAL_RTC_Disable(&hrtc);",
      "",
      "HAL_RTC_SetTime(&hrtc, &sTime);",
      "",
      `sDate.Century = ${Math.floor(rtcDateTime.year / 100) + 1};`,
      `sDate.Day = ${rtcDateTime.day};`,
      `sDate.Month = ${Months[rtcDateTime.month]};`,
      `sDate.Year = ${rtcDateTime.year % 100};`,
      "",
      "",
      "",
      "",
      "HAL_RTC_Enable(&hrtc);",
    ]);
  } else {
    // bla bla example
    mainc.includes.push("#include <iostream>");
    mainc.defines.push('#define HELLO_WORLD "Hello, world!"');
    mainc.privateFunctionPrototypes.push(
      ...[GENERATED_BY, "int test() {", "printf(HELLO_WORLD);", "}", ""]
    );

    mainc.main.push(...[GENERATED_BY, "test();", ""]);
  }

  return context;
};
