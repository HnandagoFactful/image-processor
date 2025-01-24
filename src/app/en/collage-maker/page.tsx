'use client';

import dynamic from "next/dynamic";
import ContainerLayout from "@/components/globals/ContainerLayout";
import pageProvider from "@/providers/PageProvider";
import { ErrorBoundary } from "react-error-boundary";
import useAlerts from "@/hooks/useAlerts";
const CollageMaker = dynamic(() => import("@/views/collage-maker/CollageMaker"), {
    ssr: false
});
 

export default function ImageProcess() {
    const {
        alert,
        resetAlert,
        setAlertContentType
    } = useAlerts()

    return (<pageProvider.Provider value={{
        pageName: 'collagemaker',
        ...alert,
        setAlertContentType,
        resetAlert
    }}>
        <ContainerLayout pageName="collagemaker">
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <CollageMaker />
            </ErrorBoundary>
        </ContainerLayout>
    </pageProvider.Provider>)
}