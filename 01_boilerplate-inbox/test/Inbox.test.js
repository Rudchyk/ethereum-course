const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { abi, evm } = require('../compile');

const web3 = new Web3(ganache.provider());
const initialMessage = 'Hi there!';

let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [initialMessage],
    })
    .send({
      from: accounts[0],
      gas: '1000000',
    });
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message',  async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, initialMessage);
  });

  it('has a updated message',  async () => {
    const updatedMessage = 'Hello world!';
    await inbox.methods.setMessage(updatedMessage).send({
      from: accounts[0],
    });
    const message = await inbox.methods.message().call();
    assert.equal(message, updatedMessage);
  });
});
