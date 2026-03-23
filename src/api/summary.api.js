import client from "./client";

export const getMonthlySummary = (year, month) => 
    client.get(`/summary/${year}/${month}`)