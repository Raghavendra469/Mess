const calculateRoyalty = (streams) => {
    if (streams <= 10000) return streams * 0.002;
    if (streams <= 50000) return (10000 * 0.002) + ((streams - 10000) * 0.005);
    return (10000 * 0.002) + (40000 * 0.005) + ((streams - 50000) * 0.01);
};

// Service to calculate royalty based on streams
const calculateRoyaltyForStreams =  (royalty) => {
    // console.log('inside trhe calcula royalty', royalty);
    const totalRoyalty = calculateRoyalty(royalty.totalStreams);
    royalty.totalRoyalty = totalRoyalty;
    royalty.royaltyDue = totalRoyalty - royalty.royaltyPaid; // Calculate pending royalty
    console.log('before calculate royalty save')
    // await royalty.save();
    console.log('after calculate royalty save')
    return royalty;
};

module.exports = { calculateRoyaltyForStreams };
