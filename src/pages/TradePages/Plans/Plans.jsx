import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import LoadingSpinner from './components/LoadingSpinner';
import PaymentResult from './components/PaymentResult';
import PricingBackground from './components/PricingBackground';
import PricingHeader from './components/PricingHeader';
import PricingCard from './components/PricingCard';
import FAQ from './components/FAQ';
import usePayment from './hooks/usePayment';
import usePlans from './hooks/usePlans';

const PricingPlans = () => {
    const { websiteId } = useParams();
    const navigate = useNavigate();

    const { plans, loading } = usePlans(websiteId);
    const { isProcessingPayment, setIsProcessingPayment, callPaymentApi, activateFreePlan } = usePayment();

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPaymentResult, setShowPaymentResult] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("برای دسترسی به این بخش ابتدا وارد شوید.");
            navigate("/login");
        }
    }, [navigate]);

    const handlePlanSelect = async (planId) => {
        const selectedPlanData = plans.find(p => p.id === planId);
        if (!selectedPlanData) {
            alert('پلن انتخاب شده یافت نشد');
            return;
        }

        if (isProcessingPayment) {
            console.log('Payment already in progress...');
            return;
        }

        setSelectedPlan(planId);

        try {
            if (selectedPlanData.isFree) {
                console.log('🔥 Processing free plan activation...');
                
                const response = await activateFreePlan(websiteId);
                if (response.success) {
                    console.log('✅ Free plan activated successfully');
                    navigate(`/rules/${websiteId}`);
                } else {
                    console.error('❌ Failed to activate free plan');
                    setPaymentSuccess(false);
                    setShowPaymentResult(true);
                }
            } else {
                console.log('🔥 Processing paid plan payment...');
                
                await callPaymentApi(selectedPlanData.apiId, websiteId);
                

            }
        } catch (error) {
            console.error('❌ Payment error:', error);
            
            if (selectedPlanData.isFree) {
                setPaymentSuccess(false);
                setShowPaymentResult(true);
            } else {
                alert('خطا در پردازش پرداخت. لطفاً دوباره تلاش کنید.');
            }
        } finally {
            setSelectedPlan(null);
        }
    };

    const handlePaymentResultClose = () => {
        setShowPaymentResult(false);
        setSelectedPlan(null);
    };

    if (loading) return <LoadingSpinner />;

    if (showPaymentResult) {
        return (
            <PaymentResult
                paymentSuccess={paymentSuccess}
                selectedPlan={selectedPlan}
                plans={plans}
                onClose={handlePaymentResultClose}
            />
        );
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden" dir="rtl">
            <PricingBackground />
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="max-w-7xl mx-auto w-full">
                    <PricingHeader />
                    <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                        {plans.map((plan) => (
                            <PricingCard
                                key={plan.id}
                                plan={plan}
                                onSelect={handlePlanSelect}
                                isProcessing={isProcessingPayment}
                                selectedPlan={selectedPlan}
                            />
                        ))}
                    </div>
                    <FAQ />
                </div>
            </div>
        </div>
    );
};

export default PricingPlans;