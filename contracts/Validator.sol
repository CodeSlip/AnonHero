    pragma solidity ^0.4.0;
    pragma experimental ABIEncoderV2;
    import "github.com/Arachnid/solidity-stringutils/strings.sol";
    import "./Double.sol";

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

        constructor(address newSmlAddress){
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
