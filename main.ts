radio.setGroup(1)

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
        // Convert full string to bytes
        const bytes: number[] = []

        for (const char of stringToSend) {
            console.log(char.charCodeAt(0))
        }        
    }
    
    onRecieve(callback: Function) {

    }
}

const rwrapper = new RadioWrapper(3)

rwrapper.sendString("coolió")
