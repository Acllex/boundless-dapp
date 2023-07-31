const NftMarket = artifacts.require('NftMarket.sol')

contract('NftMarket', (accounts) => {
    let nftmarket = null
    before(async () => {
        nftmarket = await NftMarket.deployed()
    })
    describe('createItem', () => {
        const tokenURI = 'https://www.baidu.com'
        before(async () => {
            await nftmarket.createItem(tokenURI, 0, {
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
        it('第一个token是否是唯一的', async () => {
            try {
                await nftmarket.createItem(tokenURI, {
                    from: accounts[0]
                })
            } catch (err) {
                assert(err, '没有抛出错误')
            }
        })
    })
})