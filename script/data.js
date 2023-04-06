// Interest Values

const interestValue = {
  micro: [
    49, //from 0 to 9,500
    49, //from 10,000 to 50,000
    49, // from 51,000 to 100,000
    40.5, // from 101,000 to 200,000
    37.5, //from 201,000 to 500,00
    36, //from 501,000 to 1,000,000
    35, // 1,000,000 and above
  ],
  microRenew: [
    // for clients who will renew in 7 days of old loan
    47, //from 0 to 9,500
    47, //from 10,000 to 50,000
    47, //from 51,000 to 100,000
  ],
  microLecked: [
    // for leaked client who did not renew in 60 days
    45, //from 0 to 9,500
    45, //from 10,000 to 50,000
    45, //from 51,000 to 100,000
  ],
  consume: [
    52, // from outsider sellers
    48, // from halan app
    37.7, // loan for employees
  ],
};
export default interestValue;
