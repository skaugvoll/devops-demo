export const waitFor = (ms:number) => { //pass a time in milliseconds to this function
    return new Promise(resolve => setTimeout(resolve, ms));
  }