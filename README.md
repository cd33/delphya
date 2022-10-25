# Delphya
## Scope
### Smart Contract
* 1 contrat général
  - ERC20, achetable contre eth, rate arbitraire.
  - Stockage d’User: pseudo et éventuellement d’autres params.
  - Stockage de Prediction: description, dateLimit, un bool didItHappened et éventuellement d’autres params
  _ Fonction createPrediction() onlyOwner
  
* On doit pouvoir déposer l’erc20 sur une prédiction
* Si on a bon après la date limite de la prédiction, on doit pouvoir récupérer ses gains
  - Vous pouvez utiliser cette formule simple : gain = (mise perso / mise totale des winners) x mise totale
* Seul l’admin du contrat peut créer une prédiction et déterminer la résultante
La difficulté réside dans la manière de gérer vos liens et stockages. Alors attention à bien avoir toutes les informations !

### Front
* ADMIN: Créer une prédiction
* ADMIN: Déterminer une résultante
* Acheter des tokens
* Miser sur une prédiction
* Withdraw ses gains
C’est donc 5 boutons/input qui sont attendus, aucun style ne sera requis.
Si vous avez le temps, un affichage de la balance des tokens et des eth du compte


## Commands Used
### Init
```shell
yarn init
yarn add hardhat
yarn hardhat
yarn add --dev "hardhat@^2.11.1" "@nomicfoundation/hardhat-toolbox@^2.0.0" "@nomicfoundation/hardhat-network-helpers@^1.0.0" "@nomicfoundation/hardhat-chai-matchers@^1.0.0" "@nomiclabs/hardhat-ethers@^2.0.0" "@nomiclabs/hardhat-etherscan@^3.0.0" "chai@^4.2.0" "ethers@^5.4.7" "hardhat-gas-reporter@^1.0.8" "solidity-coverage@^0.8.0" "@typechain/hardhat@^6.1.2" "typechain@^8.1.0" "@typechain/ethers-v5@^10.1.0" "@ethersproject/abi@^5.4.7" "@ethersproject/providers@^5.4.7" "@types/chai@^4.2.0" "@types/mocha@^9.1.0" "@types/node@>=12.0.0" "ts-node@>=8.0.0" "typescript@>=4.5.0" "dotenv" "@openzeppelin/contracts" "prettier-plugin-solidity"
```

### Hardhat
```
yarn hardhat run .\scripts\deploy.ts --network goerli
yarn hardhat typechain
yarn hardhat test
yarn hardhat coverage
```

### Front
```
yarn create client --typescript
yarn add react-toastify
yarn add react-loader-spinner
```