pragma solidity ^0.4.0;
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
    function toDouble(string memory doubleString) public view returns (double memory ret){
        var str = doubleString.toSlice();
        ret.negative = isNegative(doubleString);
        ret.integer = stringToUint(str.split(".".toSlice()).toString());
        ret.indent = str.len();
        ret.fraction = stringToUint(str.toString());
    }
    function lt(double self, double a) pure returns (bool){
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
    function lt(double self, int a) pure returns (bool){
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
    function gt(double memory self, double memory a) pure returns (bool){
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
    function gt(double self, int a) pure returns (bool){
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
    function equal(double self, double a) pure returns (bool){
        if (self.negative == a.negative &&
            self.integer == a.integer &&
            self.fraction == a.fraction)
            return true;
        return false;
    }
    function equalFraction(double a, double b) pure returns(bool){
        if (a.indent < b.indent) {
            a.fraction *= int(10**(b.indent - a.indent));
        } else {
            b.fraction *= int(10**(a.indent - b.indent));
        }
        return a.fraction == b.fraction;
    }
    function lessFraction(double a, double b) private pure returns(bool){
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
    function stringToUint(string s) private pure returns (int result) {
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