import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogService } from './blogs/application/blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogEntity, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { PostsRepository } from './posts/infrastructure/post.repository';
import { PostEntity, PostSchema } from './posts/domain/post.entity';
import { NewestLikesEntity, NewestLikesSchema } from './posts/domain/last.three.likes.entity';
import { ExtendedLikesEntity, ExtendedLikesSchema } from './posts/domain/extended.like.entity';
import { PostsQueryRepository } from './posts/infrastructure/query/posts.query-repository';
import { PostService } from './posts/application/post.service';
import { PostsController } from './posts/api/post.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: BlogEntity.name, schema: BlogSchema },
            { name: PostEntity.name, schema: PostSchema },
            { name: NewestLikesEntity.name, schema: NewestLikesSchema },
            { name: ExtendedLikesEntity.name, schema: ExtendedLikesSchema },
        ]),
    ],
    controllers: [BlogsController, PostsController],
    providers: [BlogService, PostService, BlogsQueryRepository, BlogsRepository, PostsQueryRepository, PostsRepository],
})
export class BloggersPlatformModule {}
