import { Spin } from "antd";

export function CenterSpin() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <Spin />
        </div>
    );
}