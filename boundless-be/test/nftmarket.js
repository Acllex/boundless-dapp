const NftMarket = artifacts.require('NftMarket.sol')
const { ethers } = require('ethers');
contract('NftMarket', (accounts) => {
    let nftmarket = null
    let _nftPrice = ethers.parseEther('0.1').toString();
    const _listingPrice = ethers.parseEther('0.025').toString();
    before(async () => {
        nftmarket = await NftMarket.deployed()
    })
    describe('createItem', () => {
        const tokenURI = 'https://www.baidu.com'
        before(async () => {
            await nftmarket.mintToken(tokenURI, _nftPrice, {
                from: accounts[0],
                value: _listingPrice
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
    describe("Buy Nft", () => {
        before(async () => {
            await nftmarket.buyNft("1", {
                from: accounts[1],
                value: _nftPrice
            });
        })
        it('是否还在列表中', async () => {
            const nftItem = await nftmarket.getNftItem(1);
            assert.equal(nftItem.isListed, false, 'Nft还在list中');
        })
        it('获取当前市场Nft数量', async () => {
            const count = await nftmarket.listedItemsCount();
            assert.equal(count.toNumber(), 0, 'Nft数量不正确');
        })
        it('Nft应变更了所有者', async () => {
            const owner = await nftmarket.ownerOf(1);
            assert.equal(owner, accounts[1], 'Nft没有变更了所有者');
        })
    })
    describe("Token transfers", () => {
        before(async () => {
            await nftmarket.mintToken('https://www.baidu1.com', _nftPrice, {
                from: accounts[0],
                value: _listingPrice
            })
        })
        it("应有两个Nfts", async () => {
            const totalSupply = await nftmarket.totalSupply();
            assert.equal(totalSupply.toNumber(), 2, 'Nft数量不正确');
        })
        it("可以通过index检索Nft", async () => {
            const nft1 = await nftmarket.tokenByIndex(0);
            const nft2 = await nftmarket.tokenByIndex(1);
            assert.equal(nft1.toNumber(), 1, 'Nft1不正确');
            assert.equal(nft2.toNumber(), 2, 'Nft2不正确');
        })
        it("售卖列表中应有一个Nfts", async () => {
            const nftList = await nftmarket.getAllNftsOnSale();
            assert.equal(nftList.length, 1, '售卖列表中的Nft数量不正确');
            assert.equal(nftList[0].tokenId, 2, '售卖列表中的Nft不正确');
        })
        it("accounts[1]应该有一个Nft", async () => {
            const ownedNftList = await nftmarket.getOwnedNfts({ from: accounts[1] });
            // console.log(ownedNftList);
            assert.equal(ownedNftList.length, 1, 'accounts[1]的Nft数量不正确');
        })
        it("accounts[0]应该有一个Nft", async () => {
            const ownedNftList = await nftmarket.getOwnedNfts({ from: accounts[0] });
            // console.log(ownedNftList);
            assert.equal(ownedNftList.length, 1, 'accounts[0]的Nft数量不正确');
        })
    })
    describe("转移NFT", () => {
        before(async () => {
            await nftmarket.transferFrom(accounts[0], accounts[1], 2);
        })
        it("accounts[0]应该有0个Nft", async () => {
            const ownedNftList = await nftmarket.getOwnedNfts({ from: accounts[0] });
            assert.equal(ownedNftList.length, 0, 'accounts[0]的Nft数量不正确');
        })
        it("accounts[1]应该有两个Nft", async () => {
            const ownedNftList = await nftmarket.getOwnedNfts({ from: accounts[1] });
            assert.equal(ownedNftList.length, 2, 'accounts[1]的Nft数量不正确');
        })
    })
    // describe("销毁Token", () => {
    //     const tokenURI = 'https://www.baidu11.com'
    //     before(async () => {
    //         await nftmarket.mintToken(tokenURI, _nftPrice, {
    //             from: accounts[2],
    //             value: _listingPrice
    //         })
    //     })
    //     it("accounts[2]有一个Nft", async () => {
    //         const ownedNftList = await nftmarket.getOwnedNfts({ from: accounts[2] });
    //         const allNfts = await nftmarket.getAllNftsOnSale();
    //         assert.equal(ownedNftList.length, 1, 'accounts[2]的Nft数量不正确');
    //     })
    //     it("销毁accounts[2]的Nft", async () => {
    //         await nftmarket.burnTokenId(3, { from: accounts[2] });
    //         const allNfts = await nftmarket.getAllNftsOnSale();
    //         const ownedNftList = await nftmarket.getOwnedNfts({ from: accounts[2] });
    //         assert.equal(ownedNftList.length, 0, 'accounts[2]的Nft数量不正确');
    //     })
    // })
    describe("把Nft放到售卖列表中", () => {
        before(async () => {
            await nftmarket.placeNftOnSale(1, _nftPrice, {
                from: accounts[1],
                value: _listingPrice
            });
        })
        it("Nft应该在售卖列表中", async () => {
            const nftList = await nftmarket.getAllNftsOnSale();
            assert.equal(nftList.length, 2, '售卖列表中的Nft数量不正确');
        })
        it("设置一个新的挂牌手续费", async () => {
            await nftmarket.setListingPrice(ethers.parseEther('1').toString(), { from: accounts[0] });
            const listingPrice = await nftmarket.listingPrice();
            assert.equal(listingPrice.toString(), ethers.parseEther('1').toString(), '设置挂牌手续费失败');
        })
    })
    describe("从售卖列表中移除Nft", () => {
        before(async () => {
            await nftmarket.cancelNftOnSale(1, {
                from: accounts[1]
            });
        })
        it("Nft应该不在售卖列表中", async () => {
            const nftList = await nftmarket.getAllNftsOnSale();
            assert.equal(nftList.length, 1, '售卖列表中的Nft数量不正确');
        })
    })
})