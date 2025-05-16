import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PubSubService {
    private readonly pubSub = new PubSub();

    async publish(event: string, payload: any) {
        await this.pubSub.publish(event, payload);
    }

    asyncIterator<T>(event: string): AsyncIterator<T> {
        return this.pubSub.asyncIterableIterator(event);
    }
}