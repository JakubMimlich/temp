// Add your code here

// Namespace for your library
//% color=#78A3A6 icon="\u232C" block="DS18B20"
namespace DS18B20 {
    
    const DigitalPins = [
        DigitalPin.P14,
        DigitalPin.P13,
        DigitalPin.P8,
        DigitalPin.P15
    ]

    export enum Port {
        //% block="PORT1"
        PORT1 = 0,
        //% block="PORT2"
        PORT2 = 1,
        //% block="PORT3"
        PORT3 = 2,
        //% block="PORT4"
        PORT4 = 3

    }

    let sc_byte = 0
    let dat = 0
    let low = 0
    let high = 0
    let temp = 0
    let temperature = 0
    let ack = 0
    let lastTemp = 0

    let selectedPort = Port.PORT1

    export enum ValType {
        //% block="[℃]" enumval=0
        DS18B20_temperature_C,

        //% block="[℉]" enumval=1
        DS18B20_temperature_F
    }
    function init_18b20(mpin: DigitalPin) {
        pins.digitalWritePin(mpin, 0)
        control.waitMicros(600)
        pins.digitalWritePin(mpin, 1)
        control.waitMicros(30)
        ack = pins.digitalReadPin(mpin)
        control.waitMicros(600)
        return ack
    }
    function write_18b20(mpin: DigitalPin, data: number) {
        sc_byte = 0x01
        for (let index = 0; index < 8; index++) {
            pins.digitalWritePin(mpin, 0)
            if (data & sc_byte) {
                pins.digitalWritePin(mpin, 1)
                control.waitMicros(60)
            } else {
                pins.digitalWritePin(mpin, 0)
                control.waitMicros(60)
            }
            pins.digitalWritePin(mpin, 1)
            data = data >> 1
        }
    }
    function read_18b20(mpin: DigitalPin) {
        dat = 0x00
        sc_byte = 0x01
        for (let index = 0; index < 8; index++) {
            pins.digitalWritePin(mpin, 0)
            pins.digitalWritePin(mpin, 1)
            if (pins.digitalReadPin(mpin)) {
                dat = dat + sc_byte
            }
            sc_byte = sc_byte << 1
            control.waitMicros(60)
        }
        return dat
    }

    /**
   * Read temperature with OMG robotics base box for micro:bit.
   * @param state choise from C or F
   * @param port is in range of PORT1 to PORT4
   */
    //% blockId="Ds18b20Temp"
    //% block="Temperature %state at %port"
    //% group="Digital"
    //% weight=50
    export function Ds18b20Temp(state: ValType, port: Port): number {
        let pin = DigitalPins[port]
        init_18b20(pin)
        write_18b20(pin, 0xCC)
        write_18b20(pin, 0x44)
        basic.pause(10)
        init_18b20(pin)
        write_18b20(pin, 0xCC)
        write_18b20(pin, 0xBE)
        low = read_18b20(pin)
        high = read_18b20(pin)
        temperature = high << 8 | low
        temperature = temperature / 16
        if (temperature > 130) {
            temperature = lastTemp
        }
        lastTemp = temperature
        switch (state) {
            case ValType.DS18B20_temperature_C:
                return (Math.round(temperature*10)/10)
            case ValType.DS18B20_temperature_F:
                temperature = (temperature * 1.8) + 32
                return temperature
            default:
                return 0
        }

    }
}