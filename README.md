# AnonHero
Telling the story and proving that it happened

This application was built in a weekend by Tiffany Marroquin, Anthony Albertoria, Michael Cohen, & Jason Tissera.
It uses Torus for secure sign-in, and the Skale EVM, storage, and ML, for processing, storage and image validation.
The purpose of this platform is to help anyone tell their story, and unequivocally prove it on the blockchain, while protecting their identity.

## Pre-requisites
Set-up Torus with a custom RPC endpoint: 
https://sip1.skalenodes.com:10040

## Installation

Install this package using NPM

```bash
npm install
cd client
npm install
npm run start
```

## Usage Notes - SkaleML

To utilize the algorithm we built and deployed to SkaleML, you will probably need to check the status of the Skaled network:
http://157.245.138.108:2234. It's a very early version of the network and may no longer be up.
If it's no longer up, you'll be required to deploy all of the contracts in this application to a new SML supported Skale chain. This include the validator.sol, ML model and dataset. You'll receive a predictor location once this is complete, such as: cifar10_resnet, which will be added to the validator.sol.

Video of the app in action: https://youtu.be/K9nGj2UuQYM

[![Alt text](https://img.youtube.com/vi/K9nGj2UuQYM/0.jpg)](https://www.youtube.com/watch?v=K9nGj2UuQYM)
