// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title UFO Invasions Cross-Chain NFT System 🛸
 * @dev Contract pentru mintarea și managementul NFT-urilor cu misiuni spațiale
 * @author George Pricop (Gzeu)
 */
contract UFOInvasionsNFT is ERC721Enumerable, ERC721URIStorage, ReentrancyGuard, Ownable, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // 🛸 Constante pentru diferite tipuri de NFT-uri
    enum UFOType {
        SCOUT_SHIP,     // NFT de bază pentru beginners
        BATTLE_CRUISER, // NFT pentru utilizatori activi
        MOTHERSHIP,     // NFT premium pentru whale-uri
        SPECIAL_EDITION // NFT-uri limitate pentru evenimente
    }
    
    enum MissionBadge {
        PUMP_HUNTER,
        DEGEN_EXPLORER, 
        COSMIC_WHALE,
        TREND_RIDER,
        SOCIAL_SCOUT,
        DIAMOND_HANDS,
        ALPHA_FINDER,
        GUILD_MASTER
    }
    
    // 📊 Metadata pentru fiecare NFT
    struct UFOMetadata {
        UFOType shipType;
        MissionBadge[] badges;
        uint256 powerLevel;
        uint256 experiencePoints;
        uint256 totalRewards;
        uint256 missionsCompleted;
        uint256 mintedAt;
        bool isStaked;
        uint256 lastRewardClaim;
    }
    
    // 🎆 Sistem de recompense dinamice
    struct RewardPool {
        uint256 totalUsdt;
        uint256 dailyDistribution;
        uint256 lastDistribution;
        mapping(address => uint256) userRewards;
        mapping(address => uint256) lastClaim;
    }
    
    // 🌐 Cross-chain compatibility
    struct CrossChainData {
        mapping(uint256 => string) chainNames;
        mapping(uint256 => address) bridgeContracts;
        mapping(uint256 => bool) supportedChains;
    }
    
    // 📋 Storage variables
    mapping(uint256 => UFOMetadata) public ufoMetadata;
    mapping(address => uint256[]) public userNFTs;
    mapping(UFOType => uint256) public mintPrices;
    mapping(UFOType => string) public baseURIs;
    mapping(address => bool) public authorizedMinters;
    mapping(MissionBadge => string) public badgeNames;
    
    RewardPool public rewardPool;
    CrossChainData public crossChainData;
    
    // ⚡ Events
    event NFTMinted(address indexed user, uint256 indexed tokenId, UFOType shipType);
    event BadgeEarned(address indexed user, uint256 indexed tokenId, MissionBadge badge);
    event RewardsClaimed(address indexed user, uint256 amount);
    event PowerLevelUp(uint256 indexed tokenId, uint256 newPowerLevel);
    event CrossChainTransfer(uint256 indexed tokenId, uint256 targetChain);
    event SpecialEventNFT(address indexed user, uint256 indexed tokenId, string eventName);
    
    // 🛡️ Modifiers
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Nu esti autorizat sa mintezi");
        _;
    }
    
    modifier validTokenId(uint256 tokenId) {
        require(_exists(tokenId), "Token ID invalid");
        _;
    }
    
    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC721(name, symbol) {
        _transferOwnership(initialOwner);
        
        // Inițializare prețuri mint
        mintPrices[UFOType.SCOUT_SHIP] = 0; // Gratuit pentru beginners
        mintPrices[UFOType.BATTLE_CRUISER] = 0.01 ether;
        mintPrices[UFOType.MOTHERSHIP] = 0.05 ether;
        mintPrices[UFOType.SPECIAL_EDITION] = 0.1 ether;
        
        // Inițializare badge names
        badgeNames[MissionBadge.PUMP_HUNTER] = "Pump Hunter";
        badgeNames[MissionBadge.DEGEN_EXPLORER] = "Degen Explorer";
        badgeNames[MissionBadge.COSMIC_WHALE] = "Cosmic Whale";
        badgeNames[MissionBadge.TREND_RIDER] = "Trend Rider";
        badgeNames[MissionBadge.SOCIAL_SCOUT] = "Social Scout";
        badgeNames[MissionBadge.DIAMOND_HANDS] = "Diamond Hands";
        badgeNames[MissionBadge.ALPHA_FINDER] = "Alpha Finder";
        badgeNames[MissionBadge.GUILD_MASTER] = "Guild Master";
        
        // Inițializare reward pool
        rewardPool.dailyDistribution = 1000 * 10**18; // 1000 USDT per zi
        rewardPool.lastDistribution = block.timestamp;
    }
    
    /**
     * @dev Minte NFT gratuit pentru utilizatori noi (SCOUT_SHIP)
     * @param to Adresa beneficiarului
     * @return tokenId ID-ul tokenului creat
     */
    function mintFreeScoutShip(address to) external onlyMinter nonReentrant returns (uint256) {
        require(balanceOf(to) == 0, "Utilizatorul are deja un NFT");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        
        // Inițializare metadata
        ufoMetadata[tokenId] = UFOMetadata({
            shipType: UFOType.SCOUT_SHIP,
            badges: new MissionBadge[](0),
            powerLevel: 1,
            experiencePoints: 0,
            totalRewards: 0,
            missionsCompleted: 0,
            mintedAt: block.timestamp,
            isStaked: false,
            lastRewardClaim: block.timestamp
        });
        
        userNFTs[to].push(tokenId);
        
        emit NFTMinted(to, tokenId, UFOType.SCOUT_SHIP);
        return tokenId;
    }
    
    /**
     * @dev Minte NFT premium cu plată
     * @param to Adresa beneficiarului
     * @param shipType Tipul navei spațiale
     * @return tokenId ID-ul tokenului creat
     */
    function mintPremiumUFO(address to, UFOType shipType) external payable nonReentrant returns (uint256) {
        require(shipType != UFOType.SCOUT_SHIP, "Scout ship este gratuit");
        require(msg.value >= mintPrices[shipType], "ETH insuficient pentru mint");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        
        // Metadata mai avantajoasă pentru NFT-uri premium
        uint256 initialPowerLevel = shipType == UFOType.MOTHERSHIP ? 10 : 5;
        
        ufoMetadata[tokenId] = UFOMetadata({
            shipType: shipType,
            badges: new MissionBadge[](0),
            powerLevel: initialPowerLevel,
            experiencePoints: 0,
            totalRewards: 0,
            missionsCompleted: 0,
            mintedAt: block.timestamp,
            isStaked: false,
            lastRewardClaim: block.timestamp
        });
        
        userNFTs[to].push(tokenId);
        
        // Adaugă ETH la reward pool
        rewardPool.totalUsdt += msg.value;
        
        emit NFTMinted(to, tokenId, shipType);
        return tokenId;
    }
    
    /**
     * @dev Adaugă badge pentru completarea unei misiuni
     * @param tokenId ID-ul tokenului
     * @param badge Badge-ul de adăugat
     */
    function addMissionBadge(uint256 tokenId, MissionBadge badge) external onlyMinter validTokenId(tokenId) {
        UFOMetadata storage metadata = ufoMetadata[tokenId];
        
        // Verifică dacă badge-ul nu există deja
        for (uint i = 0; i < metadata.badges.length; i++) {
            if (metadata.badges[i] == badge) {
                return; // Badge-ul există deja
            }
        }
        
        metadata.badges.push(badge);
        metadata.missionsCompleted++;
        metadata.experiencePoints += 100; // +100 XP per misiune
        
        // Level up logic
        if (metadata.experiencePoints >= metadata.powerLevel * 500) {
            metadata.powerLevel++;
            emit PowerLevelUp(tokenId, metadata.powerLevel);
        }
        
        emit BadgeEarned(ownerOf(tokenId), tokenId, badge);
    }
    
    /**
     * @dev Revendică recompensele acumulate
     * @param tokenId ID-ul tokenului pentru care se revendică
     */
    function claimRewards(uint256 tokenId) external nonReentrant validTokenId(tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Nu ești proprietarul acestui NFT");
        
        UFOMetadata storage metadata = ufoMetadata[tokenId];
        require(block.timestamp >= metadata.lastRewardClaim + 24 hours, "Recompensele pot fi revendicate o data pe zi");
        
        uint256 reward = calculateDailyReward(tokenId);
        require(reward > 0, "Nu ai recompense de revendicat");
        require(rewardPool.totalUsdt >= reward, "Pool de recompense insuficient");
        
        metadata.lastRewardClaim = block.timestamp;
        metadata.totalRewards += reward;
        rewardPool.totalUsdt -= reward;
        rewardPool.userRewards[msg.sender] += reward;
        
        // Transfer USDT (implementare cu IERC20)
        // IERC20(usdtToken).transfer(msg.sender, reward);
        
        emit RewardsClaimed(msg.sender, reward);
    }
    
    /**
     * @dev Calculează recompensa zilnică bazată pe power level și badges
     * @param tokenId ID-ul tokenului
     * @return reward Recompensa calculată
     */
    function calculateDailyReward(uint256 tokenId) public view validTokenId(tokenId) returns (uint256) {
        UFOMetadata storage metadata = ufoMetadata[tokenId];
        
        uint256 baseReward = 1 * 10**18; // 1 USDT bază
        uint256 powerMultiplier = metadata.powerLevel;
        uint256 badgeBonus = metadata.badges.length * 0.5 * 10**18; // +0.5 USDT per badge
        
        // Bonus pentru tipul navei
        uint256 shipBonus = 0;
        if (metadata.shipType == UFOType.BATTLE_CRUISER) {
            shipBonus = 2 * 10**18; // +2 USDT
        } else if (metadata.shipType == UFOType.MOTHERSHIP) {
            shipBonus = 5 * 10**18; // +5 USDT
        } else if (metadata.shipType == UFOType.SPECIAL_EDITION) {
            shipBonus = 10 * 10**18; // +10 USDT
        }
        
        return baseReward + (baseReward * powerMultiplier / 10) + badgeBonus + shipBonus;
    }
    
    /**
     * @dev Obține toate badge-urile unui NFT
     * @param tokenId ID-ul tokenului
     * @return badges Array cu badge-urile
     */
    function getTokenBadges(uint256 tokenId) external view validTokenId(tokenId) returns (MissionBadge[] memory) {
        return ufoMetadata[tokenId].badges;
    }
    
    /**
     * @dev Obține metadata completă pentru un token
     * @param tokenId ID-ul tokenului
     * @return metadata Structura cu toate datele
     */
    function getTokenMetadata(uint256 tokenId) external view validTokenId(tokenId) returns (UFOMetadata memory) {
        return ufoMetadata[tokenId];
    }
    
    /**
     * @dev Obține toate NFT-urile unui utilizator
     * @param user Adresa utilizatorului
     * @return tokenIds Array cu ID-urile tokenilor
     */
    function getUserNFTs(address user) external view returns (uint256[] memory) {
        return userNFTs[user];
    }
    
    // 🔧 Admin functions
    function addAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }
    
    function removeAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
    }
    
    function setMintPrice(UFOType shipType, uint256 price) external onlyOwner {
        mintPrices[shipType] = price;
    }
    
    function addToRewardPool() external payable onlyOwner {
        rewardPool.totalUsdt += msg.value;
    }
    
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // 🔄 Override functions pentru compatibilitate
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Update user NFT arrays
        if (from != address(0) && to != address(0)) {
            // Remove from old owner
            uint256[] storage fromTokens = userNFTs[from];
            for (uint i = 0; i < fromTokens.length; i++) {
                if (fromTokens[i] == tokenId) {
                    fromTokens[i] = fromTokens[fromTokens.length - 1];
                    fromTokens.pop();
                    break;
                }
            }
            
            // Add to new owner
            userNFTs[to].push(tokenId);
        }
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}