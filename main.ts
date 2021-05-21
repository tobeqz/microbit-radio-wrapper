
/* 
 * Deze class is nodig omdat je maximaal 18 bytes
 * aan data kunt sturing via 1 sendString() call
 * dit staat HELEMAAL NERGENS in de documentatie
 * en ik kwam er na iets van 3 uur debuggen achter
 * dus bij deze, een radio wrapper die makecode eigenlijk
 * zelf moet supplyen als ze "beginnner friendly" willen
 * zijn. Het support alleen strings, omdat JSON.parse en
 * JSON.stringify te veel moeite waren voor microsoft
 * om te implementeren.
 */
class RadioWrapper {
    callbacks: Function[]
    
    constructor(radioGroup: number) {
        radio.setGroup(radioGroup)
        this.callbacks = []

        let full_string = ""
        radio.onReceivedString(slice => {
            full_string += slice
            if (slice[slice.length-1] == "\u{03}") {
                for (const callback of this.callbacks) {
                    callback(full_string)
                }

                full_string = ""
            }
        })
    }

    sendString(stringToSend: string) {
        const string_with_boundary = `\u{02}${stringToSend}\u{03}`
        // 02 en 03 staan in ASCII voor start en einde respectievelijk

        for (let i = 0; i < string_with_boundary.length; i += 18) {
            const slice = string_with_boundary.substr(i, 18)
            radio.sendString(slice)
        }
    }
    
    onReceive(callback: Function) {
        this.callbacks.push(callback)        
    }
}

const rwrapper = new RadioWrapper(3)

const start = control.millis()
rwrapper.onReceive((msg: string) => {
    console.log("Recieved string: " + msg)
})

rwrapper.sendString("tim's moeder is kaulo hoere bol en dik en vet asdl;fjasd;ljfasd;lfjasd;lkfjasd;lfjk")

