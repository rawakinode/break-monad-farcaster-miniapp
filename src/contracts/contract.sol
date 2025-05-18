// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BreakMonadV2 {

    address public admin;
    address payable public withdrawal_address;

    struct Article {
        uint256 id_article;
        uint256 account_id;
        address wallet_address;
        string title;
        string ipfs_url;
        uint256 tip_count;
        uint256 tip_earned;
        uint64 created_at;
        uint64 updated_at;
    }

    struct BindAddress {
        uint256 fid;
        address wallet_address;
    }

    mapping(uint256 => Article) public articles;
    uint256 public articleCounter;
    uint256[] public articleIds;

    // Mapping dari FID ke list address
    mapping(uint256 => address[]) private account_bind;

    // Mapping dari address ke FID (untuk memastikan 1 address hanya di-bind sekali)
    mapping(address => uint256) public address_bind;

    event ArticleCreated(uint256 indexed id, address indexed author);
    event ArticleUpdated(uint256 indexed id);
    event ArticleTipped(uint256 indexed articleId, address indexed from, uint256 amount);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function setAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid admin address");
        admin = _newAdmin;
    }

    function setWithdrawalAddress(address payable _withdrawal) external onlyAdmin {
        require(_withdrawal != address(0), "Invalid withdrawal address");
        withdrawal_address = _withdrawal;
    }

    function bindAccountAddress(uint256 fid, address wallet) external onlyAdmin {
        require(wallet != address(0), "Invalid wallet address");
        require(address_bind[wallet] == 0, "Wallet already bound to an FID");

        // Bind wallet to fid
        account_bind[fid].push(wallet);
        address_bind[wallet] = fid;
    }

    function createArticle(
        uint256 _accountId,
        string memory _title,
        string memory _ipfsUrl
    ) external payable returns (uint256){

        require(address_bind[msg.sender] != 0, "Wallet not bound");
        require(address_bind[msg.sender] == _accountId, "FID mismatch");
        require(account_bind[_accountId].length > 0, "FID does not exist");
        require(msg.value == 1 ether, "Must send exactly 1 MON for fee");
        require(withdrawal_address != address(0), "Withdrawal address not set");
        require(bytes(_title).length > 5 && bytes(_title).length < 100, "Title length must be > 5 and < 100 character");
        require(bytes(_ipfsUrl).length > 0, "IPFS URL required");

        // Kirim ETH ke withdrawal_address
        (bool sent, ) = withdrawal_address.call{value: msg.value}("");
        require(sent, "Failed to send MON");

        articleCounter++;
        articles[articleCounter] = Article({
            id_article: articleCounter,
            account_id: _accountId,
            wallet_address: msg.sender,
            title: _title,
            ipfs_url: _ipfsUrl,
            tip_count: 0,
            tip_earned: 0,
            created_at: uint64(block.timestamp),
            updated_at: uint64(block.timestamp)
        });
        articleIds.push(articleCounter);

        emit ArticleCreated(articleCounter, msg.sender);
        return articleCounter;
    }

    function updateArticle(
        uint256 _articleId,
        uint256 _accountId,
        string memory _newTitle,
        string memory _newIpfsUrl
    ) external payable {
        require(address_bind[msg.sender] != 0, "Wallet not bound");
        require(address_bind[msg.sender] == _accountId, "FID mismatch");
        require(account_bind[_accountId].length > 0, "FID does not exist");
        require(msg.value == 0.1 ether, "Must send exactly 0.1 MON for update fee");
        require(withdrawal_address != address(0), "Withdrawal address not set");
        require(bytes(_newTitle).length > 5 && bytes(_newTitle).length < 100, "Title length must be > 5 and < 100 characters");
        require(bytes(_newIpfsUrl).length > 0, "IPFS URL required");

        Article storage article = articles[_articleId];
        require(article.wallet_address == msg.sender, "Only owner can update");

        // Kirim ETH ke withdrawal_address
        (bool sent, ) = withdrawal_address.call{value: msg.value}("");
        require(sent, "Failed to send MON");

        article.title = _newTitle;
        article.ipfs_url = _newIpfsUrl;
        article.updated_at = uint64(block.timestamp);

        emit ArticleUpdated(_articleId);
    }

    // Function to fetch all articles
    function getAllArticles() external view returns (Article[] memory) {
        uint256 total = articleIds.length;
        Article[] memory allArticles = new Article[](total);

        for (uint256 i = 0; i < total; i++) {
            allArticles[i] = articles[articleIds[i]];
        }

        return allArticles;
    }

    // Function to get Newest article with pagination
    function getNewestArticles(uint256 offset, uint256 limit) external view returns (Article[] memory) {
        uint256 total = articleIds.length;
        require(offset < total, "Offset out of bounds");

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        Article[] memory result = new Article[](end - offset);
        for (uint256 i = 0; i < end - offset; i++) {
            result[i] = articles[articleIds[total - 1 - offset - i]];
        }

        return result;
    }

    // Function to get Oldest article with pagination
    function getOldestArticles(uint256 offset, uint256 limit) external view returns (Article[] memory) {
        uint256 total = articleIds.length;
        require(offset < total, "Offset out of bounds");

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        Article[] memory result = new Article[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = articles[articleIds[i]];
        }

        return result;
    }

    // Function to get all article by author / fid
    function getArticlesByFid(uint256 fid, uint256 offset, uint256 limit) external view returns (Article[] memory) {
        uint256 total = articleIds.length;

        // Kumpulkan dulu semua articleId milik FID dalam array sementara (max = total)
        uint256[] memory temp = new uint256[](total);
        uint256 matchCount = 0;

        // Loop mundur untuk dapatkan yang terbaru dulu
        for (uint256 i = total; i > 0; i--) {
            if (articles[articleIds[i - 1]].account_id == fid) {
                temp[matchCount] = articleIds[i - 1];
                matchCount++;
            }
        }

        // Validasi offset
        require(offset < matchCount, "Offset out of bounds");

        // Hitung batas akhir
        uint256 end = offset + limit;
        if (end > matchCount) {
            end = matchCount;
        }

        // Siapkan array hasil
        Article[] memory result = new Article[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = articles[temp[i]];
        }

        return result;
    }

    // Function to handle tip from user to article owner
    function tipArticle(uint256 _articleId) external payable {
        require(_articleId > 0 && _articleId <= articleCounter, "Invalid article ID");
        require(msg.value >= 0.01 ether, "Minimum tip is 0.01 MON");

        Article storage article = articles[_articleId];
        address payable recipient = payable(article.wallet_address);
        require(recipient != address(0), "Invalid recipient address");
        require(recipient != msg.sender, "Can't tipping self");

        // Hitung 20% fee untuk withdrawal_address
        uint256 fee = (msg.value * 20) / 100;
        uint256 ownerAmount = msg.value - fee;

        // Transfer 20% ke withdrawal_address
        (bool feeSent, ) = withdrawal_address.call{value: fee}("");
        require(feeSent, "Failed to send fee to withdrawal address");

        // Transfer 80% ke pemilik artikel
        (bool sent, ) = recipient.call{value: ownerAmount}("");
        require(sent, "Failed to send tip to article owner");

        // Update statistik artikel
        article.tip_count += 1;
        article.tip_earned += ownerAmount;

        emit ArticleTipped(_articleId, msg.sender, msg.value);
    }

    // Opsional: helper untuk cek apakah wallet sudah di-bind
    function isWalletBound(address wallet) external view returns (bool) {
        return address_bind[wallet] != 0;
    }

    // Opsional: dapatkan semua wallet yg di-bind ke FID tertentu
    function getWalletsByFID(uint256 fid) external view returns (address[] memory) {
        return account_bind[fid];
    }
}
