import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import workflowRoutes from "./routes/workflow.routes.js";
import credentialRoutes from "./routes/credential.routes.js";
import executionRoutes from "./routes/execution.routes.js";

const app = express();

app.use(express.json());

app.use(cors({
        origin: ["http://localhost:3000", "http://3.108.225.113:3000", "https://n8n.amrithehe.com", "https://api-n8n.amrithehe.com","https://autm8n.amrithehe.com"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Content-Type", "Cache-Control", "Expires"],
    })
);

app.use("/api/v1", authRoutes);               
app.use("/workflow", workflowRoutes);          
app.use("/api/v1/credentials", credentialRoutes); 
app.use("/", executionRoutes);                 




app.listen(3002, "0.0.0.0", () =>{
    console.log("Server running on port 3002");
});
