import numeral from 'numeral'

export default class Number {

    static shortenNumber(number) {
        return numeral(number).format('0.00a').replace('.00', '');
    }
}