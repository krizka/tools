
export const Bitcoin = {
    checkAddress(addrString) {
        return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(addrString);
    }
};