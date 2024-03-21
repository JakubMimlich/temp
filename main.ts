makerbit.connectLcd(39)
basic.forever(function () {
    makerbit.showStringOnLcd1602("" + (DS18B20.Ds18b20Temp(DS18B20.ValType.DS18B20_temperature_C, DS18B20.Port.PORT3)), makerbit.position1602(LcdPosition1602.Pos1), 16)
})
