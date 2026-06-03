import React from "react";
import "./LandingPage.scss";

import HeroSection        from "../components/landing/HeroSection";
import WhySection         from "../components/landing/WhySection";
import AudienceSection    from "../components/landing/AudienceSection";
import TasksSection       from "../components/landing/TasksSection";
import VisionSection      from "../components/landing/VisionSection";
import ChartsSection      from "../components/landing/ChartsSection";
import TaskFeaturesSection from "../components/landing/TaskFeaturesSection";
import ComparisonSection  from "../components/landing/ComparisonSection";
import CtaSection         from "../components/landing/CtaSection";
import LandingFooter      from "../components/landing/LandingFooter";

function LandingPage() {
    return (
        <div className="landing-page" dir="rtl">

            {/* Background blobs */}
            <div className="landing-bg" aria-hidden="true">
                <div className="bg-blob bg-blob--1" />
                <div className="bg-blob bg-blob--2" />
                <div className="bg-blob bg-blob--3" />
            </div>

            <HeroSection />
            <WhySection />
            <AudienceSection />
            <TasksSection />
            <VisionSection />
            <ChartsSection />
            <TaskFeaturesSection />
            <ComparisonSection />
            <CtaSection />
            <LandingFooter />

        </div>
    );
}

export default LandingPage;