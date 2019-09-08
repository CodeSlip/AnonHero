pragma solidity ^0.4.25;
pragma experimental ABIEncoderV2;
import "github.com/Arachnid/solidity-stringutils/strings.sol";

library Double {
    using strings for *;
    struct double {
        bool negative;
        uint indent;
        int integer;
        int fraction;
    }
    function toDouble(string memory doubleString) public returns (double memory ret){
        var str = doubleString.toSlice();
        ret.negative = isNegative(doubleString);
        ret.integer = stringToUint(str.split(".".toSlice()).toString());
        ret.indent = str.len();
        ret.fraction = stringToUint(str.toString());
    }
    function lt(double self, double a) returns (bool){
        if (self.negative && !a.negative){
            return true;
        }
        if (!self.negative && a.negative){
            return false;
        }
        if (!self.negative && !a.negative){
            if (self.integer == a.integer) return lessFraction(self, a);
            return self.integer < a.integer;
        }
        if (self.integer == a.integer) return lessFraction(a, self);
        return self.integer > a.integer;
    }
    function lt(double self, int a) returns (bool){
        if (self.negative && a >= 0){
            return true;
        }
        if (!self.negative && a < 0){
            return false;
        }
        if (!self.negative && a >= 0){
            return self.integer < a;
        }
        if (self.integer == -a && self.fraction > 0) return true;
        return self.integer > -a;
    }
    function gt(double memory self, double memory a) returns (bool){
        if (self.negative && !a.negative){
            return false;
        }
        if (!self.negative && a.negative){
            return true;
        }
        if (!self.negative && !a.negative){
            if (self.integer == a.integer) return lessFraction(a, self);
            return self.integer > a.integer;
        }
        if (self.integer == a.integer) return lessFraction(self, a);
        return self.integer < a.integer;
    }
    function gt(double self, int a)  returns (bool){
        if (self.negative && a >= 0){
            return false;
        }
        if (!self.negative && a < 0){
            return true;
        }
        if (!self.negative && a >= 0){
            if (self.integer == a && self.fraction > 0) return true;
            return self.integer > a;
        }
        return self.integer < -a;
    }
    function equal(double self, double a)  returns (bool){
        if (self.negative == a.negative &&
            self.integer == a.integer &&
            self.fraction == a.fraction)
            return true;
        return false;
    }
    function equalFraction(double a, double b)  returns(bool){
        if (a.indent < b.indent) {
            a.fraction *= int(10**(b.indent - a.indent));
        } else {
            b.fraction *= int(10**(a.indent - b.indent));
        }
        return a.fraction == b.fraction;
    }
    function lessFraction(double a, double b) private  returns(bool){
        if (a.indent < b.indent) {
            a.fraction *= int(10**(b.indent - a.indent));
        } else {
            b.fraction *= int(10**(a.indent - b.indent));
        }
        return a.fraction < b.fraction;
    }
    function isNegative(string doubleString) private returns (bool){
        bytes memory b = bytes(doubleString);
        uint c = uint(b[0]);
        return c == 45;
    }
    function stringToUint(string s) private  returns (int result) {
        bytes memory b = bytes(s);
        uint i;
        result = 0;
        for (i = 0; i < b.length; i++) {
            int c = int(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
    }
}


interface sml{
    function predict(string predictorName, string input, string output) external;
    function getResults(string outputFile) external view returns (Double.double[]);
}

contract Validator {
    using strings for *;
    using Double for Double.double;
    address smlAddress;
    string constant PREDICTOR_NAME = "resnet";
    string constant OUTPUT_FILENAME = "resnet.out";
    event Message(uint length, Double.double[] pred, uint maxIdx);

    constructor(address newSmlAddress) {
        smlAddress = newSmlAddress;
    }

    function validate(address owner, string fileName) public view returns(bool){
        string memory fileDir = toAsciiString(owner).toSlice().concat('/'.toSlice());
        string memory filePath = fileDir.toSlice().concat(fileName.toSlice());
        string memory outputFile = OUTPUT_FILENAME;
        sml(smlAddress).predict(PREDICTOR_NAME, filePath, outputFile);
        Double.double[] memory predictions = sml(smlAddress).getResults(outputFile);
        uint maxIdx = 0;
        for (uint i = 1; i < predictions.length; ++i){
            if (Double.gt(predictions[i], predictions[maxIdx])){
                maxIdx = i;
            }
        }
        if (maxIdx > 280 && maxIdx < 287) return false;
        return true;
    }

    function toAsciiString(address x) private pure returns (string) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            byte b = byte(uint8(uint(x) / (2**(8*(19 - i)))));
            byte hi = byte(uint8(b) / 16);
            byte lo = byte(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);
        }
        return string(s);
    }
    
    function char(byte b) private pure returns (byte c) {
        if (b < 10) return byte(uint8(b) + 0x30);
        else return byte(uint8(b) + 0x57);
    }
}


