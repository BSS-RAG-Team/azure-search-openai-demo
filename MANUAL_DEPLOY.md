# Manual Deployment Guide via Azure Portal

## Step 1: Create Azure OpenAI Service

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your resource group `mgmt_rag`
3. Click **+ Create** → Search for **Azure OpenAI**
4. Fill in:
   - **Region**: Sweden Central (or your preferred region)
   - **Name**: `openai-rag-assistant`
   - **Pricing tier**: Standard S0
5. Click **Review + Create** → **Create**

### Deploy Models:
After creation:
1. Go to [Azure OpenAI Studio](https://oai.azure.com/)
2. Click **Deployments** → **+ Create new deployment**
3. Create these deployments:
   - **Model**: gpt-4o-mini → **Deployment name**: `chat` → **Capacity**: 30K TPM
   - **Model**: text-embedding-3-large → **Deployment name**: `embedding` → **Capacity**: 30K TPM

---

## Step 2: Create Azure AI Search

1. In Azure Portal → Resource group `mgmt_rag`
2. Click **+ Create** → Search for **Azure AI Search**
3. Fill in:
   - **Service name**: `search-rag-assistant`
   - **Pricing tier**: Basic
   - **Semantic ranker**: Free (1000 queries/month) or Standard
4. Click **Review + Create** → **Create**

---

## Step 3: Create Storage Account

1. In Azure Portal → Resource group `mgmt_rag`
2. Click **+ Create** → Search for **Storage account**
3. Fill in:
   - **Name**: `storageragassistant` (must be unique, lowercase, no hyphens)
   - **Performance**: Standard
   - **Redundancy**: ZRS (or LRS for lower cost)
4. Click **Review + Create** → **Create**

### Create Containers:
After creation:
1. Go to the storage account → **Containers**
2. Create these containers:
   - `content`
   - `images`
   - `tokens`

---

## Step 4: Create App Service

1. In Azure Portal → Resource group `mgmt_rag`
2. Click **+ Create** → Search for **Web App**
3. Fill in:
   - **Name**: `rag-assistant-app` (must be globally unique)
   - **Runtime**: Python 3.11
   - **Region**: Sweden Central
   - **Pricing plan**: Basic B1 (or higher for production)
4. Click **Review + Create** → **Create**

### Enable Managed Identity:
1. Go to the App Service → **Identity**
2. Under **System assigned** → Turn **Status** to **On**
3. Click **Save**

---

## Step 5: Configure RBAC (Role Assignments)

You need to grant the App Service's managed identity access to resources.

### For Azure OpenAI:
1. Go to your Azure OpenAI resource
2. Click **Access control (IAM)** → **+ Add** → **Add role assignment**
3. Select **Cognitive Services OpenAI User**
4. Click **Next** → **Managed identity** → Select your App Service
5. Click **Review + assign**

### For Storage Account:
Repeat the above for these roles:
- **Storage Blob Data Contributor**
- **Storage Queue Data Contributor**

### For AI Search:
- **Search Index Data Contributor**
- **Search Service Contributor**

---

## Step 6: Deploy Application Code

### Option A: Deploy from GitHub (Easiest)
1. Go to your App Service → **Deployment Center**
2. Select **GitHub** → Authorize
3. Select:
   - **Organization**: BSS-RAG-Team
   - **Repository**: azure-search-openai-demo
   - **Branch**: main
4. Build provider: **GitHub Actions**
5. Click **Save**

### Option B: Deploy from VS Code
1. Install [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice)
2. In VS Code, right-click your App Service
3. Select **Deploy to Web App**
4. Select the `app/backend` folder

---

## Step 7: Configure Environment Variables

1. Go to App Service → **Environment variables**
2. Add these:

```
AZURE_OPENAI_ENDPOINT=https://openai-rag-assistant.openai.azure.com/
AZURE_OPENAI_CHATGPT_DEPLOYMENT=chat
AZURE_OPENAI_EMB_DEPLOYMENT=embedding
AZURE_SEARCH_SERVICE=https://search-rag-assistant.search.windows.net
AZURE_SEARCH_INDEX=gptkbindex
AZURE_STORAGE_ACCOUNT=storageragassistant
AZURE_STORAGE_CONTAINER=content
USE_CHAT_HISTORY_BROWSER=true
```

3. Click **Apply** → **Confirm**

---

## Step 8: Upload Data & Index

Since you can't use the `prepdocs.sh` script, use Azure AI Search Studio:

1. Go to [Azure AI Search Studio](https://portal.azure.com)
2. Navigate to your search service → **Import data**
3. Select **Azure Blob Storage** as data source
4. Connect to your `storageragassistant` → `content` container
5. Follow the wizard to create an index

Or upload documents manually and use the **Import and vectorize data** feature.

---

## Verification

1. Go to your App Service → **Browse**
2. The RAG chat app should load
3. Try asking a question

---

## Troubleshooting

### App doesn't start:
- Check **Log stream** in App Service
- Verify all environment variables are set
- Ensure managed identity has correct role assignments

### Can't access resources:
- Verify RBAC roles are assigned correctly
- Check if firewall rules are blocking access

