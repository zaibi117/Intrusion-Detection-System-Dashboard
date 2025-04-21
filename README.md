# Network Traffic Analysis Dashboard - Frontend

## Overview

The **Network Traffic Analysis Dashboard** is a real-time web application for monitoring and analyzing network traffic data. This frontend is built using **Next.js** with a clean UI developed using **Shadcn UI**. The dashboard allows users to interact with and manage network traffic data captured by a backend Intrusion Detection System (IDS). Users can view network flows, apply filters, check system status, and control packet sniffing.

## Features

- **Real-time Network Flow Monitoring**: View and filter network traffic based on various parameters such as source IP, destination IP, ports, protocol, classification, and risk level.
- **Real-time System Status**: View the current status of the IDS, including the number of flows processed and the number of active flows.
- **Packet Sniffing Control**: Start and stop packet sniffing to capture new network flows in real-time.
- **Flow Table**: Display a table of captured network flows with detailed information like source and destination, protocol, duration, classification, and risk.
- **Filters**: Apply filters on different flow attributes to drill down into specific traffic data.

## Tech Stack

- **Next.js**: React-based framework for server-side rendering and static site generation.
- **Shadcn UI**: A modern UI component library for building accessible and customizable interfaces.
- **Lucide Icons**: A set of icons used throughout the application.
- **Axios**: For API requests to the backend.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repository/network-traffic-dashboard.git
   cd network-traffic-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   ```

3. **Run the application locally**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to access the dashboard.

## Project Structure

### `app/page.tsx`

- The **Dashboard** page that displays the overall system status and network flow data.
- It fetches API status, initial flows, and updates them periodically using polling.
- It uses the **StatusCards** component to show system status and the **FlowTable** component to display captured network flows.

### `app/components/dashboard/FlowTable.tsx`

- A table component that displays detailed information about network flows.
- Allows filtering by various flow attributes such as source IP, destination IP, source port, destination port, protocol, classification, and risk.
- Uses **FilterDropdown** components for each column filter.

### `app/hooks/useApi.ts`

- Custom React hook that manages API calls and state for fetching flows, system status, and controlling packet sniffing.
- Provides functions to fetch initial flows, fetch new flows periodically, refresh flows, and start/stop packet sniffing.

### `app/types/apiTypes.ts`

- Defines TypeScript interfaces for the flow data, API status, and filter state used throughout the application.

## API Endpoints

- `GET /flows`: Fetches all network flows.
- `GET /status`: Fetches the current status of the IDS.
- `POST /start`: Starts packet sniffing.
- `POST /stop`: Stops packet sniffing.

## Filtering Flows

The flow data is filterable by the following attributes:

- **Source IP (Src)**
- **Source Port (SrcPort)**
- **Destination IP (Dest)**
- **Destination Port (DestPort)**
- **Protocol**
- **Classification**
- **Risk Level**

You can clear a filter by clicking on the "Clear" button next to the filter dropdown.

## UI Components

- **StatusCards**: Displays the status of the IDS (whether sniffing is active and the number of active/processed flows).
- **FlowTable**: Displays the network flows in a table, with each flow's detailed attributes and risk level.
- **FilterDropdown**: A reusable component for filtering flow data by various attributes.

## Example Usage

After running the application, you'll be able to:

1. **Start packet sniffing**: Click the "Start Sniffing" button to begin capturing network flows.
2. **View captured flows**: The flows will be displayed in the **FlowTable** with relevant details such as source and destination IPs, protocol, flow duration, classification, probability, and risk level.
3. **Apply filters**: Use the filter dropdowns to narrow down the displayed flows by specific attributes.
4. **Refresh flows**: Click the "Refresh" button to fetch the latest flows from the backend.

---

For further assistance, feel free to create an issue in the repository or contact the development team.