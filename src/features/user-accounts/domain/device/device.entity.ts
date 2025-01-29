import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { HydratedDocument, Model } from 'mongoose';
import { UserDocument } from '../user/user.entity';
import { DeletionStatus, DeletionStatusType } from '@libs/contracts/enums/deletion-status.enum';
import crypto from 'node:crypto';

@Schema({ timestamps: false })
export class DeviceEntity {
    @Prop({
        type: 'UUID',
        required: true,
        default: () => randomUUID(),
    })
    deviceId: string;

    @Prop({ type: Date, required: true })
    issuedAt: Date;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, required: true })
    ip: string;

    @Prop({ type: Date, required: true })
    lastActiveDate: Date;

    @Prop({ type: String, required: true })
    deviceName: string;

    @Prop({ type: String, required: true })
    refreshToken: string;

    @Prop({ type: String, required: true, default: DeletionStatus.enum['not-deleted'] })
    deletionStatus: DeletionStatusType;

    public static buildInstance(dto: any) {
        const session = new this();
        session.deviceId = dto.deviceId;
        session.issuedAt = dto.issuedAt;
        session.userId = dto.userId;
        session.ip = dto.ip;
        session.deviceName = dto.deviceName;
        session.lastActiveDate = dto.lastActiveDate;
        session.refreshToken = dto.refreshToken;
        return session as DeviceDocument;
    }

    makeDeleted() {
        this.deletionStatus = DeletionStatus.enum['permanent-deleted'];
    }
}

export const DeviceSchema = SchemaFactory.createForClass(DeviceEntity);

DeviceSchema.loadClass(DeviceEntity);

export type DeviceDocument = HydratedDocument<DeviceEntity>;

export type DeviceModelType = Model<DeviceDocument> & typeof DeviceEntity;
