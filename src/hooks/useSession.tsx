import { Customer } from '@/types/objects';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';



interface SessionContextType {
    customer: Customer | null;
    setCustomer: (customer: Customer | null) => void;
    loaded: boolean
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loaded, setLoaded] = useState(false)
    
    useEffect(() => setLoaded(true), [customer])

    useEffect(() => {
        // Load customer from localStorage on component mount
        const storedCustomer = localStorage.getItem('customer');
        if (storedCustomer) {
            setCustomer(JSON.parse(storedCustomer));
        }
        setLoaded(true)
    }, []);

    const setCustomerWithStorage = (customer: Customer | null) => {
        // Save customer to localStorage
        if (customer ) {
            localStorage.setItem('customer', JSON.stringify(customer));
        }else {
            localStorage.removeItem('customer');
        }
       
        setCustomer(customer);
    };

    return (
        <SessionContext.Provider value={{ customer, setCustomer: setCustomerWithStorage, loaded }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = (): SessionContextType => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};