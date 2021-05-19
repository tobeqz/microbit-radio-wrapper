radio.onReceivedNumber(num => {
    console.log(num)
})
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
    constructor(radioGroup: number) {
        radio.setGroup(radioGroup)
    }
    
    sendString(stringToSend: string) {
        const char_codes: number[] = [
            -1,
            -1
        ]
        // De receivers krijgen deze charcodes nummer
        // voor nummer, wanneer de receiver twee -1's achter
        // elkaar ziet, betekent dat het begin van een nieuwe
        // string
        //
        // -2, -2 betekent het einde van een string

        for (const char of stringToSend) {
            char_codes.push(char.charCodeAt(0))
            console.log(char.charCodeAt(0))
        }        

        char_codes.push(-2)
        char_codes.push(-2)
        
        for (const code of char_codes) {
            radio.sendNumber(code)
        }
    }
    
    onReceive(callback: Function) {

    }
}

const rwrapper = new RadioWrapper(3)

rwrapper.sendString("coolió")
