/**
 *
 * @param  {Array<[PromiseSettledResult<any>]>} requests
 * @returns {any[]}
 */
const MultiRequest = (...requests) => {
    return requests.map((v) => {
        if (v[0].status === "rejected") {
            throw new Error(v[0].reason, { cause: "" });
        }
        return v?.[0].value;
    });
};

export default MultiRequest