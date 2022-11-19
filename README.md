# LiquidBet
Betting dApp
## Inspiration
Our inspiration stems from the issues that current Betting dApps face as they navigate through void order book, nobody wanting to pay fees to be a maker in a betting market. In addition to that, come the limitations of centralized betting platforms that can void bets for no reasons, and even limits players deemed too profitable.

## What it does
LiquidBet is a Betting DeX based on liquidity pools in order to allow people easy acces to betting as a better or as a booker.

## How we built it
LiquidBet was built with several parts:
### The Website
The Website is built with nextJS, WAGMI, and nodeJS.
### The SmartContract
The DeX contract is built in solidity and making use of erc20 tokens to represent bets and liquidity, allowing people to use their "bet slip" as they want, and builders to add any possible functionality such as leverage betting or anything.
### Chainlink Oracles
To reconsile the results of each bets, the contracts uses a custom job running on our nodes created through linkpool.io
the job is used to querry a sport api from sportdataIO, but we aim to create an aggregation of several apis in order to have more robust and trusted results, through Chainlink.

## Challenges we ran into
We ran into a few Challenges
### Continuous integration
Being a team from remote places in the world and each working on it's own parts, it was a challenge to keep everything well integrated.
### Data sources
It was pretty difficult to find sources for only the result of a soccer game. We based our dapp around sport betting, and the world cup was perfect for this, but most of the sport APIs are focused on a data heavy usage of events, but not specially on the final result of a game.

### Deployement of our node
We first deployed our own node in one of our PC, using Quicknode as a blockchain data source, but the compute of the node and the requirement to let the pc on 24/7 pushed us to use the Linkpool service, which was of great use !

## Accomplishments that we're proud of
Creating a great interface and PoC for completely decentralised betting with no risk of bad debts for the contract and allowing users to hadge their bets in any venues of their choices.

## What we learned
We learned a lot on smart-contract security, node deployements, WAGMI integration, and game theory to avoid potentials exploits !

## What's next for LiquidBet
* creation of betting market with personalised fees to allow smaller markets
* Ability to track current active betting market
* account management to follow historical data
