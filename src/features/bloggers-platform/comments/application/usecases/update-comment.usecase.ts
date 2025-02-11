import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../../infrastructure/comment.repository';
import { ForbiddenDomainException } from '../../../../../core/exceptions/incubator-exceptions/domain-exceptions';

export class UpdateContentCommentCommand {
    constructor(
        public readonly commentId: string,
        public readonly content: string,
        public readonly userId: string,
    ) {}
}

// Этот декоратор связывает команду с соответствующим обработчиком.
// Когда команда CreateCommentCommand будет отправлена в систему,
// она будет автоматически направлена в класс CreateCommentUseCase для обработки.
// Это позволяет отделить команду от логики обработки
@CommandHandler(UpdateContentCommentCommand)
export class UpdateContentCommentUseCase implements ICommandHandler<UpdateContentCommentCommand> {
    constructor(private readonly commentsRepository: CommentRepository) {}
    async execute(command: UpdateContentCommentCommand) {
        const comment = await this.commentsRepository.findCommentById(command.commentId);
        if (comment.commentatorInfo.userId !== command.userId) {
            throw ForbiddenDomainException.create();
        }
        comment.updateContent(command.content);
        await this.commentsRepository.save(comment);
    }
}
