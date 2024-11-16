import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { Router } from 'express';
import { addItem, getItem, getUser, startGame, stopGame } from "../utilities/nftStorageCheck";
import * as fcl from "@onflow/fcl";
import { User } from './metaLootClient';

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
        // difirent ? wit 2 use ?
        let currentUser = fcl.currentUser();
        const subscribe = fcl.currentUser.subscribe(async (currentUser: User) => {
            console.log("this is sub user ", currentUser);
            const item = getItem(currentUser.addr, req.params.itemId);
            res.json({
                data: item,
                timestamp: new Date().toISOString(),
                status: "success"
            });
        });

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
        startGame();
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
        stopGame();
        res.json({
            data: "🎮 Game session ended! Your epic loot has been minted as NFTs and added to your collection! 🏆✨",
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
        const { itemName, itemType, attributes, thumpNail } = req.body as {
            itemName: string;
            itemType: string;
            attributes: object;
            thumpNail: string;
        };
        // Implement item addition logic here
        addItem(itemName,itemType,attributes,thumpNail);
        res.json({
            data: "🎯 Epic item added to your collection! Your new loot awaits! ✨🎮",
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

function readItem() {
    throw new Error('Function not implemented.');
}
