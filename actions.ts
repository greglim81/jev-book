"use server";

import { noul, choice, score, TypeSafeClient, NoulQuestion, ChoiceQuestion, ScoreQuestion } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();

export async function processTicket(ticket: string) {
    const response = await client.systemOne({
        state:{ 
            ticket,
        },
        questions:{
            requiresHumanAttention: noul(
                "Does `ticket` require attention from a human customer support agent?"
            ),
            ticketType: choice("which category best describes `ticket`",
                {
                    billing: "A billing, payment, or subscription issue",
                    technical: "A technical problem or product malfunction",
                    account: "An account access or account management issue",
                    refund: "A request for a refund or cancellation",
                    generalInquiry: "A general question or request for information",
                    other: "A customer support request that does not fit the other categories",
                }
            ),
            priority: score(
            "How urgent is the customer support issue described in `ticket`?",
                [
                    "Low priority: A general question/minor issue that does not significantly affect the customer.",
                    "Moderate priority: Issue causing some inconvenience but with a workaround or limited impact.",
                    "High priority: Serious issue significantly affecting  customer's ability to use the service.",
                    "Critical priority: Urgent issue. Complete loss of service. Require immediate attention.",
                ]
            )
        }
    })
    return response;
}

export async function processTickets(tickets: string[]) {  
    tickets = tickets.map((ticket) => ticket.trim()).filter(Boolean);
    if (!tickets.length) throw new Error("Enter at least one ticket.");
    const questions: {[key: string]: NoulQuestion | ChoiceQuestion | ScoreQuestion} = {};

    tickets.forEach((_, index) =>{
        questions[`ticket_${index}_requiresHumanAttention`] = noul(
            `Does \`tickets[${index}]\` require attention from a human customer support agent?`
        );
        questions[`ticket_${index}_ticketType`] = choice(`Which category best describes \`tickets[${index}]\`?`,
            {
                billing: "A billing, payment, or subscription issue",
                technical: "A technical problem or product malfunction",
                account: "An account access or account management issue",
                refund: "A request for a refund or cancellation",
                generalInquiry: "A general question or request for information",
                other: "A customer support request that does not fit the other categories",
            }            
        );    
        questions[`ticket_${index}_priority`] = score(`How urgent is the customer support issue described in \`tickets[${index}]\`?`,
            [
                "Low priority: A general question/minor issue that does not significantly affect the customer.",
                "Moderate priority: Issue causing some inconvenience but with a workaround or limited impact.",
                "High priority: Serious issue significantly affecting  customer's ability to use the service.",
                "Critical priority: Urgent issue. Complete loss of service. Require immediate attention.",
            ]          
        );             
    });
    
    const response = await client.systemOne({
        state:{ 
            tickets,
        },
        questions,
    })
    return response;
}
