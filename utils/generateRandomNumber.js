/**
 * @description GENERATE number to send otp 
 * @author Bhautik Kevadiya
 * @param {*} min 
 * @param {*} max 
 * @param {*} n 
 * @param {*} val 
 * @returns Generate random number
 */
exports.generateRandomNumber = (min, max, n, val = []) => {
    if (n) {
      const number = Math.ceil(Math.random() * (max - min) + min);
      n--;
      val.push(number);
      this.generateRandomNumber(min, max, n, val);
    }
    return val;
  };