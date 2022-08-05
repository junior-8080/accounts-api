module.exports = {
    success : (data,res) => {
        switch (data.StatusCode) {
            case 201:
                return res.status(201).json(data);
            case 401:
                return res.status(201).json(data);
            case 404:
                return res.status(201).json(data);
            default:
                case 200:
                    return res.status(200).json(data);
        }
    },
    error: (error,res) => {
        return res.status(500).json(error)
    }

}