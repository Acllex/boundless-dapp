const NftMarket = artifacts.require('NftMarket.sol')
const { ethers } = require('ethers');
contract('NftMarket', (accounts) => {
    let nftmarket = null
    let _nftPrice = ethers.parseEther('0.1').toString();
    console.log('ethers', ethers);
    before(async () => {
        nftmarket = await NftMarket.deployed()
    })
    describe('createItem', () => {
        const tokenURI = 'https://www.baidu.com'
        before(async () => {
            await nftmarket.mintToken(tokenURI, _nftPrice, {
                from: accounts[0]
            })
        })
        it('创建token是否是accounts[0]', async () => {
            const owner = await nftmarket.ownerOf(1)
            // assert(owner === accounts[0], 'owner is not accounts[0]')
            assert.equal(owner, accounts[0], 'owner is not accounts[0]')
        })
        it('第一个token是否指向正确的tokenURI', async () => {
            const actTokenURI = await nftmarket.tokenURI(1)
            assert.equal(actTokenURI, tokenURI, '没有指向正确的tokenURI')
        })
        it('不能用使用过的tokenURI', async () => {
            try {
                await nftmarket.mintToken(tokenURI, _nftPrice, {
                    from: accounts[0]
                })
            } catch (err) {
                assert(err, '没有抛出错误')
            }

        })
        it('查看有多少Nft', async () => {
            const listedItems = await nftmarket.listedItemsCount();
            assert.equal(listedItems.toNumber(), 1, '没有正确的Nft数量')
        })
        it('获取指定的Nft', async () => {
            const item = await nftmarket.getNftItem(1);
            assert.equal(item.tokenId, 1, '没有正确的Nft')
            assert.equal(item.price, _nftPrice, '没有正确的价格')
            assert.equal(item.creator, accounts[0], '没有正确的拥有者')
            assert.equal(item.isListed, true, '是否在售')
        })
    })
})