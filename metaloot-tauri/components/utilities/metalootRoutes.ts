import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { Router } from 'express';
import { getUser } from "../utilities/nftStorageCheck";
import * as fcl from "@onflow/fcl";

const router = Router();

// Define interface for authenticated user
interface AuthenticatedRequest extends Request {
    user?: {
        loggedIn: boolean;
    };
}

// Middleware to check user authentication
const authenticateUser: RequestHandler = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const user = req.user;
    if (!user || !user.loggedIn) {
        res.status(401).json({
            data: "Please login with Flow wallet",
            timestamp: new Date().toISOString(),
            status: "error"
        });
        return;
    }
    next();
};

// Get user information
router.get('/user/:address', authenticateUser, async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const userInfo = await getUser(req.params.address);
        res.json({
            data: userInfo,
            timestamp: new Date().toISOString(),
            status: "success"
        });
    } catch (error) {
        res.status(500).json({
            data: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            status: "error"
        });
    }
});

// Read item metadata
router.get('/item/:itemId/metadata', authenticateUser, async (req, res) => {
    try {
        // Implement item metadata reading logic here
        res.json({
            data: { /* item metadata */ },
            timestamp: new Date().toISOString(),
            status: "success"
        });
    } catch (error) {
        res.status(500).json({
            data: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            status: "error"
        });
    }
});

// Start game session
router.post('/game/start', authenticateUser, async (req, res) => {
    try {
        // Implement game start logic here
        res.json({
            data: { sessionId: 'new-session-id' },
            timestamp: new Date().toISOString(),
            status: "success"
        });
    } catch (error) {
        res.status(500).json({
            data: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            status: "error"
        });
    }
});

// End game session
router.post('/game/:sessionId/end', authenticateUser, async (req, res) => {
    try {
        // Implement game end logic here
        res.json({
            data: { sessionId: req.params.sessionId },
            timestamp: new Date().toISOString(),
            status: "success"
        });
    } catch (error) {
        res.status(500).json({
            data: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            status: "error"
        });
    }
});

// Add new item
router.post('/item', authenticateUser, async (req: Request, res: Response) => {
    try {
        const { name, type, rarity } = req.body as {
            name: string;
            type: string;
            rarity: string;
        };
        // Implement item addition logic here
        res.json({
            data: { name, type, rarity },
            timestamp: new Date().toISOString(),
            status: "success"
        });
    } catch (error) {
        res.status(500).json({
            data: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            status: "error"
        });
    }
});

export default router; 