const ResponseHandler = require('../utils/ResponseHandler');
const axios = require('axios');
const logger = require('../logger');
const config = require('../config');
const fs = require('fs');
const FormData = require('form-data');

function toQueryString(params) {
    return Object.entries(params)
        .filter(([_, v]) => v !== null && v !== undefined && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");
}

class AgentController {
    constructor() {
        this.responseHandler = new ResponseHandler();
        this.apiBaseUrl = config.apiBaseUrl;
        this.endpoints = {
            agent: '/upload',
            agents: '/upload/agents',
            filter: '/upload'
        }
    }

    // Helper Methods
    getAuthHeaders(token) {
        return {
            Authorization: `Bearer ${token}`
        };
    }

    async makeApiRequest(method, endpoint, data = null) {
        const config = {
            method,
            url: `${this.apiBaseUrl}${endpoint}`,
        };
        logger.info(`url: ${JSON.stringify(config.url)}`);
        logger.info(`Payload: ${JSON.stringify(data)}`);
        if (data) {
            config.data = data;
        }

        try {
            const response = await axios(config);
            return this.validateApiResponse(response);
        } catch (error) {
            throw this.handleApiError(error);
        }
    }

    validateApiResponse(response) {
        if (response.data) {
            console.log('statusCode:', response.data.statusCode)
            return response.data;
        }
        throw {
            status: response.status || 500,
            message: response.data?.message || 'API request failed'
        };
    }

    handleApiError(error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log(error.response)
                return {
                    status: error.response.status,
                    message: error.response.data?.message || 'API request failed'
                };
            }
            return {
                status: 500,
                message: `API request failed: ${error.message}`
            };
        }
        return {
            status: 500,
            message: 'An unexpected error occurred'
        };
    }

    async uploadAgentsFromExcel(req, res) {
        try {
            const file = req.file;

            if (!file) {
                return this.responseHandler.sendResponse(
                    res,
                    400,
                    false,
                    'Excel file is required.'
                );
            }

            logger.info(`File received: ${file.originalname}`);

            // Create FormData and attach file
            const formData = new FormData();
            formData.append('file', fs.createReadStream(file.path), file.originalname);

            const result = await this.makeApiRequest(
                'post',
                '/upload',
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                }
            );

            //logger.info(`Excel agents upload result:\n${JSON.stringify(result, null, 2)}`);

            return this.responseHandler.sendResponse(
                res,
                200,
                true,
                'Excel uploaded and agents added successfully.',
                result.data
            );
        } catch (error) {
            logger.error('Error during Excel agents upload:', error);
            return this.responseHandler.sendResponse(
                res,
                error.status || 500,
                false,
                error.message || 'Failed to upload agents.'
            );
        }
    }

    async getAllAgents(req, res) {
        try {

            const result = await this.makeApiRequest(
                'get',
                this.endpoints.agents,
            );

            return res.render('report', { agents: result.data || [] });

        } catch (error) {
            logger.error('Error retrieving terms:', error);
            if (error === 'Invalid or expired token') {
                return res.redirect('/')
            }
            return this.responseHandler.sendResponse(
                res,
                error.status,
                false,
                error.message
            );
        }
    }

    async getFilteredResults(req, res) {
        try {

            if (Object.keys(req.query).length === 0) {
                console.log("No query parameters provided. Returning empty dataset.");
                return res.status(200).json({
                    status: 200,
                    message: "No filters provided, returning empty dataset.",
                    data: [] // Return an empty array for DataTables
                });
            }

            const filters = {
                branch_id: req.query.branch_id || null,
                dateRange: req.query.dateRange || null,
                fromDate: req.query.fromDate || null,
                toDate: req.query.toDate || null,
            };

            const queryString = toQueryString(filters);

            const result = await this.makeApiRequest(
                'get',
                `${this.endpoints.filter}?${queryString}`,
            );

            return this.responseHandler.sendResponse(
                res,
                200,
                true,
                'User registered successfully.',
                result
            );

        } catch (error) {
            logger.error('Error retrieving results:', error);
            if (error === 'Invalid or expired token') {
                return res.redirect('/')
            }
            return this.responseHandler.sendResponse(
                res,
                error.status,
                false,
                error.message
            );
        }
    }

}

module.exports = AgentController;